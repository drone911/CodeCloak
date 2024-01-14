import { Schema, model } from 'mongoose';

interface IVirusTotalMetadata extends Document {
    names: string[],
    tags: string[],
    reputation: Number,
    typeTags: string[],
    fetchTime: Date
}

interface IFileVirusTotal extends Document {
    sha256hash: string,
    metadata: IVirusTotalMetadata
}

const virusTotalSchema = new Schema<IVirusTotalMetadata>({
    names: { type: [String] },
    tags: { type: [String] },
    reputation: { type: Number },
    typeTags: { type: [String] },
    fetchTime: { type: Date }
});


const fileVirusTotalSchema = new Schema<IFileVirusTotal>({
    sha256hash: { type: String, required: true },
    metadata: { type: virusTotalSchema }
});

export const FileVirusTotalModel = model<IFileVirusTotal>('FileVirusTotal', fileVirusTotalSchema);
