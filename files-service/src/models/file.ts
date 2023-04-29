import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { FileTypes } from "@teamg2023/common";

// Interface that describes the properties that are needed to create a new File.
interface FileAttrs {
    userId: string;
    projectId: string;
    mimetype: string;
    encoding: string;
    type: FileTypes;
    name: string;
}

// Represents one single record from the database.
interface FileDoc extends mongoose.Document {
    userId: string;
    projectId: string;
    mimetype: string;
    encoding: string;
    type: FileTypes;
    version: number;
    name: string;
}

// Represents the entire collection of data.
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

// will replace mongoose versionKey property to version.
fileSchema.set('versionKey', 'version');
// updates the version automatically if the entry is modified.
fileSchema.plugin(updateIfCurrentPlugin);

fileSchema.statics.build = (attrs: FileAttrs) => {
    return new File(attrs);
}

const File = mongoose.model<FileDoc, FileModel>('File', fileSchema);

export { File };

