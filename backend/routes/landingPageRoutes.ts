import * as express from "express";
import { Request, Response } from 'express';
import { FileModel } from '../schemas/FileSchema';
import { FileVirusTotalModel } from '../schemas/VirusTotalMetaDataSchema';
import * as mcache from 'memory-cache';
import * as fs from 'fs';
import * as multer from 'multer';
import * as crypto from 'crypto';
import * as path from 'path';

const FILE_COUNT_CACHE_SECONDS = Number(process.env.NODE_FILE_COUNT_CACHE_SECONDS) || 10
const MAX_PAGE_SIZE = Number(process.env.NODE_MAX_PAGE_SIZE) || 10;
const GET_RECENT_FILES_CACHE_SECONDS = Number(process.env.NODE_GET_RECENT_FILES_CACHE_SECONDS) || 500


const storage = multer.diskStorage({
    destination: process.env.NODE_UPLOAD_DIRECTORY || 'upload',
    filename: (req, file, cb) => {
        const hash = crypto.createHash('sha256');
        hash.update(file.originalname + Date.now());
        cb(null, hash.digest('hex') + path.extname(file.originalname)) + ".blob";
    }
});

const upload = multer.default({
    storage, limits: {
        fileSize: Number(process.env.NODE_MAX_UPLOAD_FILE_SIZE)
    }
});


const routes = express.Router();

routes.get('/api/file/count', async (req: Request, res: Response) => {
    let files_count = mcache.get("db_file_count")
    if (files_count) {
        return res.json({ "count": files_count })
    } else {
        try {
            const files_count = await FileModel.countDocuments({}).exec();
            mcache.put("db_file_count", files_count, FILE_COUNT_CACHE_SECONDS * 1000)
            return res.status(200).json({ "count": files_count })
        } catch (error) {
            console.error('Error fetching document count:', error);
            return res.sendStatus(500).json({ error: 'Internal Server Error' });
        }
    }
})

routes.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const { path: filePath, filename } = req.file as Express.Multer.File;
        const fileContent = fs.readFileSync(filePath);

        const hash = crypto.createHash('sha256').update(fileContent).digest('hex');

        const existingFileDocument = await FileModel.findOne({ sha256hash: hash }, "sha256hash storedName");
        if (existingFileDocument) {
            console.debug(`[/api/upload] Returning existing File: ${hash}.`);
            return res.json({ filename: existingFileDocument.storedName, hash: existingFileDocument.sha256hash, exists: true })
        }
        const fileDocument = new FileModel({ storedName: filename, path: filePath, sha256hash: hash, size: req.file?.size })
        await fileDocument.save()
        console.debug(`[/api/upload] File created: ${hash}.`);

        return res.json({ filename, hash });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

routes.get('/api/recent-five-files', async (req: Request, res: Response) => {
    let files = mcache.get("recent-five")
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
        return res.status(500).json({ error: 'Internal Server Error' });
    }

})

routes.post('/api/files', async (req: Request, res: Response) => {
    try {
        const { hashes } = req.body;
        const files: any = await FileModel.find({
            "sha256hash": hashes.slice(0, MAX_PAGE_SIZE)
        }, "sha256hash size detectionsCount -_id", {
            lean: true
        });
        if (!files) {
            return res.json([])
        }
        const virustotalMetadatas = await FileVirusTotalModel.find({
            "sha256hash": hashes.slice(0, MAX_PAGE_SIZE)
        }, "sha256hash metadata.names -_id", {
            lean: true
        });
        for (let file of files) {
            file.commonName = "";
            const matchingVirustotalRecord = virustotalMetadatas.find((value) => {
                return value.sha256hash === file.sha256hash
            })
            if (matchingVirustotalRecord && matchingVirustotalRecord.metadata.names.length > 0) {
                file.commonName = matchingVirustotalRecord.metadata.names[0];
            }
        }
        return res.json(files)

    } catch (error) {
        console.error('Error fetching files:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default routes;