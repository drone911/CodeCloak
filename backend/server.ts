import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as cors from "cors";
import Helmet from "helmet";
import * as multer from 'multer';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as mcache from 'memory-cache';

import { FileModel } from './schemas/FileSchema';
import { FileVirusTotalModel } from './schemas/VirusTotalMetaDataSchema';

import { getFileInfoFromVirusTotal } from './utility/virustotalAPI';
import { scanFileWithClamAV } from './utility/clamAVScan';
import { getFileHeader, getRelaventFileContent } from './utility/fileContent';


const app = express();

const corsOptions = {
    origin: process.env.REACT_CORS_ORIGIN,
};

app.use(cors(corsOptions));
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
const MAX_CHARACTERS_MALICIOUS = Number(process.env.MAX_MALICIOUS_CHARACTERS_TO_RETURN) || 500;
const FILE_COUNT_CACHE_SECONDS = Number(process.env.NODE_FILE_COUNT_CACHE_SECONDS) || 10
const GET_SCAN_CACHE_SECONDS = Number(process.env.NODE_GET_SCAN_CACHE_SECONDS) || 500
const GET_RECENT_FILES_CACHE_SECONDS = Number(process.env.NODE_GET_RECENT_FILES_CACHE_SECONDS) || 500


app.get('/api/file/count', async (req: Request, res: Response) => {
    let files_count = mcache.get("db_file_count")
    if (files_count) {
        res.json({ "count": files_count })
    } else {
        try {
            const files_count = await FileModel.countDocuments({}).exec();
            mcache.put("db_file_count", files_count, FILE_COUNT_CACHE_SECONDS * 1000)
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

    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "Not Found" })
        }
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
            return res.json({ filename: existingFileDocument.storedName, hash: existingFileDocument.sha256hash, exists: true })
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


app.post('/api/file/:hash/scan', async (req: Request, res: Response) => {
    try {
        const { hash } = req.params

        const fileDocument = await FileModel.findOne({ sha256hash: hash }, 'sha256hash path countOfScans size');
        if (!fileDocument) {
            return res.status(404).json({ error: "Not Found" });
        }

        if (fileDocument.countOfScans >= MAX_SCAN_COUNT) {
            return res.status(400).json({ error: "Bad Request" })
        }
        const fileBuffer = fs.readFileSync(fileDocument.path);

        const detections = await scanFileWithClamAV(fileBuffer);
        fileDocument.detectionData = detections;
        fileDocument.detectionsCount = detections.length;
        fileDocument.countOfScans += 1;
        console.debug(`Scanned file ${fileDocument.sha256hash} ${fileDocument.countOfScans} times, and found ${fileDocument.detectionsCount} detections}.`)
        await fileDocument.save();

        const fileContent = fileBuffer.toString('utf-8');
        if (detections.length > 0) {
            const detectionsWithData = getRelaventFileContent(fileContent, detections, MAX_CHARACTERS_MALICIOUS, MAX_CHARACTERS_ABOVE_OR_BELOW)
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

app.get('/api/file/:hash/scan', async (req: Request, res: Response) => {
    try {
        const { hash } = req.params
        const cachedResponse = mcache.get(`scan/${hash}`)
        if (cachedResponse) {
            return res.json(cachedResponse);
        }
        const fileDocument = await FileModel.findOne({ sha256hash: hash }, 'sha256hash path countOfScans size detectionData');
        if (!fileDocument) {
            return res.status(404).json({ error: "Not Found" });
        }
        const fileBuffer = fs.readFileSync(fileDocument.path);
        const detections = fileDocument.detectionData;

        const fileContent = fileBuffer.toString('utf-8')
        if (detections.length > 0) {
            const detectionsWithData = getRelaventFileContent(fileContent, detections, MAX_CHARACTERS_MALICIOUS, MAX_CHARACTERS_ABOVE_OR_BELOW)
            const result = [{ "detections": detectionsWithData, "hash": hash, "size": fileDocument.size, "scanner": "ClamAV", "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/" }];
            mcache.put(`scan/${hash}`, result, GET_SCAN_CACHE_SECONDS * 1000);
            return res.json(result);
        }
        else {
            const fileHeader = getFileHeader(fileContent, MAX_CHARACTERS_ABOVE_OR_BELOW);
            const result = [{ "fileHeader": fileHeader, "scanner": "ClamAV", "size": fileDocument.size, "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/" }];
            mcache.put(`scan/${hash}`, result, GET_SCAN_CACHE_SECONDS * 1000);
            return res.json(result);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/recent-five-files', async (req: Request, res: Response) => {
    let files = mcache.get("recent-five")
    files = undefined;
    if (files) {
        return res.json(files)
    }
    try {

        files = await FileModel.find({
            detectionsCount: {
                $gte: 1
            },
        }, "-_id sha256hash size detectionsCount", {
            sort: {
                detectionsCount: -1 //Sort by Date Added DESC
            },
            limit: 5
        }).lean();
        for (let i = 0; i < files.length; i++) {
            let data: any = await FileVirusTotalModel.findOne({
                sha256hash: files[i].sha256hash
            }, "metadata.names -_id").lean();
            if (data) {
                let names = data.metadata.names;
                if (names.length > 0) {
                    files[i].commonName = names[0];
                }
            }
        }

        mcache.put("recent-five", files, GET_RECENT_FILES_CACHE_SECONDS * 1000)
        return res.json(files);

    } catch (error) {
        console.error('Error fetching recent files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

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
