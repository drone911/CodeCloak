import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as cors from "cors";
import Helmet from "helmet";
import * as multer from 'multer';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as mcache from 'memory-cache';

import { model } from 'mongoose';

import { FileModel } from './schemas/FileSchema';

const app = express();

const corsOptions = {
    origin: process.env.REACT_CORS_ORIGIN,
};

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

const MAX_PAGE_SIZE = Number(process.env.NODE_MAX_PAGE_SIZE) || 50

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

app.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const { path: filePath, filename } = req.file as Express.Multer.File;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const currentTimestamp = new Date().getTime();

        const hash = crypto.createHash('sha256').update(fileContent).digest('hex');

        const fileDocument = new FileModel({ storedName: filename, path: filePath, sha256hash: hash, size: req.file?.size })
        await fileDocument.save()

        res.json({ filename, hash });

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

        res.status(200).json(files);
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
