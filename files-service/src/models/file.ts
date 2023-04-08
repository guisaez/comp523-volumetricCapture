import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { FileTypes } from "@teamg2023/common";
import { GridFS } from "../utils/GridFS";
import { Readable } from 'stream';

interface FileAttrs {
    userId: string;
    projectId: string;
    mimetype: string;
    encoding: string;
    type: FileTypes;
    name: string;
}

interface FileDoc extends mongoose.Document {
    userId: string;
    projectId: string;
    mimetype: string;
    encoding: string;
    type: FileTypes;
    version: number;
    name: string;
}

interface FileModel extends mongoose.Model<FileDoc>{
    build(attrs: FileAttrs): FileDoc;
    uploadAndSave(file: FileDoc, readable: Readable): Promise<FileDoc>;
    updateAndSave(data: {id: string, mimetype: string, type: string, encoding: string, name: string}, readable: Readable): Promise<FileDoc>;
    deleteById(fileId: string): FileDoc;
}

const fileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(FileTypes),
        default: FileTypes.ZIP
    },
    mimetype: {
        type: String,
        required: true
    },
    encoding: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true 
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

fileSchema.set('versionKey', 'version');
fileSchema.plugin(updateIfCurrentPlugin);

fileSchema.statics.build = (attrs: FileAttrs) => {
    return new File(attrs);
}

fileSchema.statics.uploadAndSave = async (file: FileDoc, readable: Readable) => {
    const bucket = await GridFS.getBucket();

    const uploadStream = bucket.openUploadStreamWithId(file.id, file.name);

    for await (const chunk of readable) {
        if(!uploadStream.write(chunk)){
            await new Promise((resolve) => uploadStream.once('drain', resolve));
        }
    }

    return file.save();
}

fileSchema.statics.updateAndSave = async (attrs: {id: string, mimetype: string, type: string, encoding: string, name: string}, readable: Readable) => {
    const file = await File.findOne({
        _id: attrs.id,
        type: attrs.type
    })

    if(!file){
        throw new Error('File not found!')
    }

    file.set({
        mimetype: attrs.mimetype,
        name: attrs.name,
        encoding: attrs.encoding
    });

    const bucket = await GridFS.getBucket();

    const uploadStream = bucket.openUploadStreamWithId(file.id, file.name);

    for await (const chunk of readable){
        if (!uploadStream.write(chunk)) {
            await new Promise((resolve) => uploadStream.once('drain', resolve));
        }
    }

    return file.save();
}

fileSchema.statics.deleteById = async (fileId: string) => {

    const file = await File.findByIdAndDelete(fileId);

    if(!file){
        throw new Error('Invalid Id');
    }

    await (await GridFS.getBucket()).delete(file.id);

    return file;
}

const File = mongoose.model<FileDoc, FileModel>('File', fileSchema);

export { File };

