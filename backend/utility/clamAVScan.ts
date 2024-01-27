import { readFileSync } from "fs";
import { IdetectionData } from "../schemas/FileSchema"
import * as stream from 'stream';

import * as NodeClam from 'clamscan';

const clamscan = new NodeClam();

clamscan.init({
    clamdscan: {
        port: 3310,
        host: "localhost"
    },
    scanLog: process.env.NODE_CLAM_LOG_DIRECTORY || '/ClamAV/log'

})

interface IdetectionContent extends IdetectionData {
    content?: string,
    offset: number
}


const scanBufferWithClamAV = async (content: Buffer) => {
    const bufferStream = new stream.Readable();
    bufferStream.push(content);
    bufferStream.push(null);
    return await clamscan.scanStream(bufferStream);
}

const scanFileWithClamAV = async (fileContent: Buffer): Promise<IdetectionData[]> => {

    const start = 0
    const end = fileContent.byteLength - 1;

    const detections: IdetectionData[] = [];
    const fullScanResult = await scanBufferWithClamAV(fileContent);
    if(!fullScanResult.isInfected) {
        return detections;
    }

    return [];
}

const filename = "";
const filecontent = readFileSync(filename);

scanFileWithClamAV(filecontent);