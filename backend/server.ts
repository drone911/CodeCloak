import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as cors from "cors";
import Helmet from "helmet";
import * as multer from 'multer';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as mcache from 'memory-cache';
import * as stream from 'stream';

import { model } from 'mongoose';

import { FileModel, IdetectionData } from './schemas/FileSchema';
import { FileVirusTotalModel } from './schemas/VirusTotalMetaDataSchema';

import { getFileInfoFromVirusTotal } from './utility/virustotalAPI';
import * as NodeClam from 'clamscan';

const app = express();

const corsOptions = {
    origin: process.env.REACT_CORS_ORIGIN,
};

const clamscan = new NodeClam();

clamscan.init({
    scanLog: process.env.NODE_CLAM_LOG_DIRECTORY || '/ClamAV/log'

})

app.use(cors());
app.use(Helmet());

app.get('/test', (req: Request, res: Response) => {
    res.json({ "message": "Test route works!" });
});

const storage = multer.diskStorage({
    destination: process.env.NODE_UPLOAD_DIRECTORY || '/uploads',
    filename: (req, file, cb) => {
        const hash = crypto.createHash('sha256');
        hash.update(file.originalname + Date.now());
        cb(null, hash.digest('hex') + path.extname(file.originalname)) + ".blob";
    }
});

const upload = multer({
    storage, limits: {
        fileSize: Number(process.env.NODE_MAX_UPLOAD_FILE_SIZE)
    }
});

const MAX_PAGE_SIZE = Number(process.env.NODE_MAX_PAGE_SIZE) || 50;
const MAX_SCAN_COUNT = Number(process.env.NODE_MAX_SCAN_COUNT) || 5;
const MAX_CHARACTERS_ABOVE_OR_BELOW = Number(process.env.MAX_CHARACTERS_ABOVE_OR_BELOW) || 50;

app.get('/api/file/count', async (req: Request, res: Response) => {
    let files_count = mcache.get("db_file_count")
    if (files_count) {
        res.json({ "count": files_count })
    } else {
        try {
            const files_count = await FileModel.countDocuments({}).exec();
            mcache.put("db_file_count", files_count, (Number(process.env.NODE_FILE_COUNT_CACHE_SECONDS) || 10) * 1000)
            res.status(200).json({ "count": files_count })
        } catch (error) {
            console.error('Error fetching document count:', error);
            res.sendStatus(500).json({ error: 'Internal Server Error' });
        }
    }
})

app.get('/api/file/:hash/virustotal', async (req: Request, res: Response) => {
    const { hash } = req.params;
    try {
        const existingFileModel = await FileModel.findOne({ sha256hash: hash });
        if (!existingFileModel) {
            console.debug(`[/api/file/:hash/virustotal] Requested hash: ${hash} Not found.`)
            return res.status(404).json({ error: "Not Found" })
        }
        const existingMetadata = await FileVirusTotalModel.findOne({ sha256hash: hash }).select({ "metadata._id": 0 });
        if (existingMetadata) {
            console.debug(`[/api/file/:hash/virustotal] Returning existing metadata for hash: ${hash}.`)
            return res.json(existingMetadata.metadata)
        }
        const metadata = await getFileInfoFromVirusTotal(hash);
        const fileVirusTotalData = { sha256hash: hash, metadata: { names: metadata.names, tags: metadata.tags, reputation: metadata.reputation, typeTags: metadata.type_tags, fetchTime: Date() } };
        const fileVirusTotalDocument = new FileVirusTotalModel(fileVirusTotalData);
        await fileVirusTotalDocument.save();
        console.debug(`[/api/file/:hash/virustotal] Requested and Created virustotal record for hash: ${hash}.`)
        return res.json(fileVirusTotalData.metadata)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const { path: filePath, filename } = req.file as Express.Multer.File;
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const hash = crypto.createHash('sha256').update(fileContent).digest('hex');

        const existingFileDocument = await FileModel.findOne({ sha256hash: hash }, "sha256hash storedName");
        if (existingFileDocument) {
            console.debug(`[/api/upload] Returning existing File: ${hash}.`);
            return res.json({ filename: existingFileDocument.storedName, hash: existingFileDocument.sha256hash })
        }
        const fileDocument = new FileModel({ storedName: filename, path: filePath, sha256hash: hash, size: req.file?.size })
        await fileDocument.save()
        console.debug(`[/api/upload] File created: ${hash}.`);

        res.json({ filename, hash });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



const scanFileWithClamAV = async (fileContent: string): Promise<IdetectionData[]> => {

    const bufferStream = new stream.Readable();
    bufferStream.push(fileContent);
    bufferStream.push(null); // Signals the end of the stream
    try {
        const result = await clamscan.scanStream(bufferStream)
        if (!result.isInfected) {
            console.log(result.viruses);
            console.log('Buffer is clean.');
        } else {
            console.log('Buffer is infected!');
            console.log('Virus details:', result);
        }

    }
    catch (err) {
        console.error('Error during scan:', err);

    }


    return [];
}

interface IdetectionContent extends IdetectionData {
    content: string,
    offset: number
}
const getRelaventFileContent = async (fileContent: string, detections: IdetectionData[], character_threshold: number): Promise<IdetectionContent[]> => {

    return [];
}

const getFileHeader = (fileContent: string, characters: number): string => {
    return fileContent.substring(0, Math.max(fileContent.length, characters));
}

app.post('/api/file/:hash/scan', async (req: Request, res: Response) => {
    try {
        const { hash } = req.params
        const currentTimestamp = new Date().getTime();

        const fileDocument = await FileModel.findOne({ sha256hash: hash }, 'sha256hash path countOfScans size');
        if (!fileDocument) {
            return res.status(404).json({ error: "Not Found" });
        }

        console.log("MAX SCAN COUNT: %d", MAX_SCAN_COUNT)
        if (fileDocument.countOfScans >= MAX_SCAN_COUNT) {
            return res.status(400).json({ error: "Bad Request" })
        }
        const fileContent = fs.readFileSync(fileDocument.path, 'utf-8');

        const detections = await scanFileWithClamAV(fileContent);

        fileDocument.detectionData = detections;
        fileDocument.countOfScans += 1;
        await fileDocument.save();

        if (detections) {
            const detectionsWithData = await getRelaventFileContent(fileContent, detections, MAX_CHARACTERS_ABOVE_OR_BELOW)
            return res.json([{ "detections": detectionsWithData, "hash": hash, "size": fileDocument.size, "scanner": "ClamAV", "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/" }])
        }
        else {
            const fileHeader = getFileHeader(fileContent, MAX_CHARACTERS_ABOVE_OR_BELOW);

            return res.json([{ "fileHeader": fileHeader, "scanner": "ClamAV", "size": fileDocument.size, "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/" }])
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/files', async (req: Request, res: Response) => {
    try {
        const page = Math.min(Math.max(1, Number(req.query.page)), MAX_PAGE_SIZE) || 1;
        let pageSize = Number(req.query.pageSize) || 10;

        pageSize = Math.min(pageSize, MAX_PAGE_SIZE);

        const skip = (page - 1) * pageSize;

        const files = await FileModel.find().skip(skip).limit(pageSize);

    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send("An unexpected error occurred.");
});

export default app;
