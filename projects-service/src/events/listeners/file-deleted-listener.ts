import { Message } from 'node-nats-streaming';
import { Subjects, Listener, FileDeletedEvent } from '@teamg2023/common';
import { File } from '../../models/file';
import { queueGroupName } from './queue-group-name';
import { Project } from '../../models/project';
import { FileTypes } from '@teamg2023/common';

export class FileDeletedListener extends Listener<FileDeletedEvent> {
    subject: Subjects.FileDeleted = Subjects.FileDeleted;
    queueGroupName = queueGroupName;

    async onMessage(data: FileDeletedEvent['data'], msg: Message) {
        
        const { projectId, id} = data;

        const project = await Project.findByEvent({ projectId });

        if(!project){
            throw new Error('Project not found!');
        }

        const file = await File.findByIdAndDelete(id);

        if(!file){
            throw new Error('File Not Found');
        }

        switch(file.type){
            case FileTypes.ZIP:
                project.set({
                    zip_fileId: null,
                });
                break;
            case FileTypes.EXTRINSIC:
                project.set({
                    extrinsic_fileId: null,
                });
                break;
            case FileTypes.INTRINSIC:
                project.set({
                    intrinsic_fileId: null,
                });
                break;
        }

        await project.save();

        msg.ack();
    }
}