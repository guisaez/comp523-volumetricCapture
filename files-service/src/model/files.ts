import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { FileTypes } from "@teamg2023/common";

interface FilesAttrs {
    userId: string;
    mimetype: string;
    encoding: string;
    type: FileTypes;
    name: string;
}

interface FilesDoc extends mongoose.Document {
    userId: string;
    mimetype: string;
    encoding: string;
    type: FileTypes;
    version: number;
    name: string;
}

interface FilesModel extends mongoose.Model<FilesDoc>{
    build(attrs: FilesAttrs): FilesDoc;
    findByIdAndType( attr : {id: string, type: string}): Promise<FilesDoc> | null;
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

fileSchema.statics.build = (attrs: FilesAttrs) => {
    return new File(attrs);
}

fileSchema.statics.findByIdAndType = (attrs: { id: string, type: string }) => {
    return File.findOne({
        _id: attrs.id,
        type: attrs.type
    })
}

const File = mongoose.model<FilesDoc, FilesModel>('File', fileSchema);

export { File };

