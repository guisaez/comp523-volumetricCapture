import mongoose from 'mongoose';
import { ProcessStatus } from '@teamg2023/common';
import { FilesDoc} from './file';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { ProcessStatus };

interface ProjectAttrs {
    userId: string;
    projectName: string;
    createdAt:Date;
}

interface ProjectDoc extends mongoose.Document {
    userId: string;
    projectName: string;
    createdAt: Date;
    lastModifiedAt: Date;
    version: number;
    processStatus: ProcessStatus;
    zip_fileId: FilesDoc;
    extrinsic_fileId: FilesDoc;
    intrinsic_fileId: FilesDoc;
    output_fileId: FilesDoc;
}

interface ProjectModel extends mongoose.Model<ProjectDoc> {
    build(attrs: ProjectAttrs): ProjectDoc;
    findByEvent(event: {projectId: string}): Promise<ProjectDoc | null>;
}

const projectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: new Date()
    },
    lastModifiedAt: {
        type: Date,
        default: new Date()
    },
    processStatus: {
        type: String,
        enum: Object.values(ProcessStatus),
        default: ProcessStatus.NotStarted
    },
    zip_fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    extrinsic_fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    intrinsic_fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    output_fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

projectSchema.set('versionKey', 'version');
projectSchema.plugin(updateIfCurrentPlugin);

projectSchema.statics.build = (attrs: ProjectAttrs) => {
    return new Project(attrs);
}

projectSchema.statics.findByEvent = (event: {projectId: string}) => {
    return Project.findOne({
        _id: event.projectId
    });
}
const Project = mongoose.model<ProjectDoc, ProjectModel>('Project', projectSchema);

export { Project, ProjectDoc }