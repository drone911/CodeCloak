import { Schema, model } from 'mongoose';

interface IFile {
    storedName: string,
    sha256hash: string,
    path: string,
    size: number
}

const fileSchema = new Schema<IFile>({
    storedName: { type: String, required: true },
    sha256hash: { type: String, required: true },
    path: { type: String, required: true },
    size: {type: Number, required: true}
});

export const FileModel = model<IFile>('File', fileSchema);
