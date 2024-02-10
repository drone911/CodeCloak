import * as express from "express";
import { Request, Response } from 'express';
import { FileModel } from '../schemas/FileSchema';
import * as fs from 'fs';
import * as mcache from 'memory-cache';
import { FileVirusTotalModel } from '../schemas/VirusTotalMetaDataSchema';

import { getFileInfoFromVirusTotal } from '../utility/virustotalAPI';
import { getFileHeader, getRelaventFileContent } from '../utility/fileContent';


const MAX_CHARACTERS_ABOVE_OR_BELOW = Number(process.env.MAX_CHARACTERS_ABOVE_OR_BELOW) || 50;
const MAX_CHARACTERS_MALICIOUS = Number(process.env.MAX_MALICIOUS_CHARACTERS_TO_RETURN) || 100;
const GET_SCAN_CACHE_SECONDS = Number(process.env.NODE_GET_SCAN_CACHE_SECONDS) || 500


const routes = express.Router();

routes.get('/api/file/:hash/virustotal', async (req: Request, res: Response) => {
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
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

routes.get('/api/file/:hash/scan', async (req: Request, res: Response) => {
    try {
        const { hash } = req.params
        const cachedResponse = mcache.get(`scan/${hash}`)
        if (cachedResponse) {
            return res.json(cachedResponse);
        }
        const fileDocument = await FileModel.findOne({ sha256hash: hash }, 'sha256hash path countOfScans size detectionData');
        if (!fileDocument) {
            return res.status(200).json({ error: "Not Found" });
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
            const result = [{ "fileHeader": fileHeader, "hash": hash, "scanner": "ClamAV", "size": fileDocument.size, "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/" }];
            mcache.put(`scan/${hash}`, result, GET_SCAN_CACHE_SECONDS * 1000);
            return res.json(result);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default routes;