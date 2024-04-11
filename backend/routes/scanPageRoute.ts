import * as express from "express";
import { Request, Response } from 'express';
import { FileModel } from '../schemas/FileSchema';
import * as fs from 'fs';
import * as mcache from 'memory-cache';
import { scanFileWithClamAV } from '../utility/clamAVScan';
import { getFileHeader, getRelaventFileContent } from '../utility/fileContent';


const MAX_SCAN_COUNT = Number(process.env.NODE_MAX_SCAN_COUNT) || 5;
const MAX_FILE_HEADER_CHARACTERS = Number(process.env.MAX_FILE_HEADER_CHARACTERS) || 200;
const MAX_CHARACTERS_ABOVE_OR_BELOW = Number(process.env.MAX_CHARACTERS_ABOVE_OR_BELOW) || 50;
const MAX_CHARACTERS_MALICIOUS = Number(process.env.MAX_MALICIOUS_CHARACTERS_TO_RETURN) || 100;

const routes = express.Router();

routes.post('/api/file/:hash/scan', async (req: Request, res: Response) => {
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
        console.debug(`Scanned file ${fileDocument.sha256hash} ${fileDocument.countOfScans} times, and found ${fileDocument.detectionsCount} detections.`)
        await fileDocument.save();
        mcache.del("db_file_count");
        const fileContent = fileBuffer.toString('utf-8');
        if (detections.length > 0) {
            const detectionsWithData = getRelaventFileContent(fileContent, detections, MAX_CHARACTERS_MALICIOUS, MAX_CHARACTERS_ABOVE_OR_BELOW);
            mcache.del("recent-five");
            return res.json([{ "detections": detectionsWithData, "hash": hash, "size": fileDocument.size, "scanner": "ClamAV", "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/" }])
        }
        else {
            const fileHeader = getFileHeader(fileContent, MAX_FILE_HEADER_CHARACTERS);
            return res.json([{ "fileHeader": fileHeader, "scanner": "ClamAV", "size": fileDocument.size, "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/" }])
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default routes;