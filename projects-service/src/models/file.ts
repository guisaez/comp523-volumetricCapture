import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { FileTypes } from "@teamg2023/common";

interface FilesAttrs {
    id: string,
    userId: string;
    type: FileTypes;
    name: string;
}

export interface FilesDoc extends mongoose.Document {
    userId: string;
    type: FileTypes;
    version: number;
    name: string;
}

interface FilesModel extends mongoose.Model<FilesDoc>{
    build(attrs: FilesAttrs): FilesDoc;
    findByEvent(event: {id: string, version: number }):Promise<FilesDoc | null>;
}

const fileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(FileTypes),
        default: FileTypes.ZIP
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

fileSchema.statics.build = (attrs: FilesAttrs) => {
    return new File({
        _id: attrs.id,
        userId: attrs.userId,
        type: attrs.type,
        name: attrs.name
    });
}

fileSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return File.findOne({
        _id: event.id,
        version: event.version - 1
    })
}

const File = mongoose.model<FilesDoc, FilesModel>('File', fileSchema);

export { File };