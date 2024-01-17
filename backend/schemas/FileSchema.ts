import { Schema, model } from 'mongoose';

interface IdetectionData {
    startIndex: number,
    endIndex: number
}

interface IFile extends Document {
    storedName: string,
    sha256hash: string,
    path: string,
    size: number,
    countOfScans: number,
    detectionData: IdetectionData[]
}
const IdetectionSchema = new Schema<IdetectionData>({
    startIndex: { type: Number, required: true },
    endIndex: { type: Number, required: true }
})

const fileSchema = new Schema<IFile>({
    storedName: { type: String, required: true },
    sha256hash: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    countOfScans: { type: Number, default: 0 },
    detectionData: { type: [IdetectionSchema], default: []}
});

export const FileModel = model<IFile>('File', fileSchema);
export {IdetectionData};