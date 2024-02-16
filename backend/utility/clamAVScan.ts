import { IdetectionData } from "../schemas/FileSchema"

import * as stream from 'stream';

import * as NodeClam from 'clamscan';

const clamscan = new NodeClam();

clamscan.init({
    clamdscan: {
        socket: "/var/run/clamav/clamd.ctl",
        host: "127.0.0.1"
    },
    scanLog: process.env.NODE_CLAM_LOG_DIRECTORY || '/ClamAV/log'
})

const scanBufferWithClamAV = async (content: Buffer) => {
    const bufferStream = new stream.Readable();
    bufferStream.push(content);
    bufferStream.push(null);
    return await clamscan.scanStream(bufferStream);
}

async function scanFileWithClamAVUtil(fileContent: Buffer, start: number, end: number, detections: IdetectionData[]) {
    if (start >= end) {
        return
    }

    const mid: number = start + Math.floor((end - start) / 2);

    const leftResult = await scanBufferWithClamAV(fileContent.subarray(start, mid));
    const rightResult = await scanBufferWithClamAV(fileContent.subarray(mid + 1, end));

    if (leftResult.isInfected && rightResult.isInfected) {
        await scanFileWithClamAVUtil(fileContent, start, mid, detections);
        await scanFileWithClamAVUtil(fileContent, mid + 1, end, detections);

    } else if (leftResult.isInfected && !rightResult.isInfected) {
        await scanFileWithClamAVUtil(fileContent, start, mid, detections);

    }
    else if (!leftResult.isInfected && rightResult.isInfected) {
        await scanFileWithClamAVUtil(fileContent, mid + 1, end, detections);

    } else {
        detections.push({ startIndex: start, endIndex: end })
    }
}

const scanFileWithClamAV = async (fileContent: Buffer): Promise<IdetectionData[]> => {

    const start = 0
    const end = fileContent.byteLength - 1;

    const detections: IdetectionData[] = [];
    const fullScanResult = await scanBufferWithClamAV(fileContent);
    if (!fullScanResult.isInfected) {
        return detections;
    }
    await scanFileWithClamAVUtil(fileContent, start, end, detections);
    return detections;
}

export { scanFileWithClamAV }