import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as cors from "cors";
import Helmet from "helmet";
import * as multer from 'multer';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

import { model } from 'mongoose';

// Model Imports
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
        cb(null, hash.digest('hex') + path.extname(file.originalname)) + ".blob" ;
    }
});

const upload = multer({
    storage, limits: {
        fileSize: Number(process.env.NODE_MAX_UPLOAD_FILE_SIZE)
    }
});

app.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        console.log(req.file)
        const { path: filePath, filename } = req.file as Express.Multer.File;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const currentTimestamp = new Date().getTime();

        console.log(path)
        console.log(filename)
        const hash = crypto.createHash('sha256').update(fileContent).digest('hex');

        const fileDocument = new FileModel({ storedName: filename, path: filePath, sha256hash: hash, size: req.file?.size })
        await fileDocument.save()

        res.json({ filename, hash });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send("An unexpected error occurred.");
});

export default app;
