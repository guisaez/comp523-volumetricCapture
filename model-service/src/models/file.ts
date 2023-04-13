import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { FileTypes } from "@teamg2023/common";

interface FileAttrs {
    id: string
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
    return new File({
        _id: attrs.id,
        userId: attrs.userId,
        type: attrs.type,
        name: attrs.name,
        projectId: attrs.projectId,
        mimetype: attrs.mimetype,
        encoding: attrs.encoding
    })
}

const File = mongoose.model<FileDoc, FileModel>('File', fileSchema);

export { File, FileDoc };

