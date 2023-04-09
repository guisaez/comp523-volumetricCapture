import { Message } from 'node-nats-streaming';
import { Subjects, Listener, FileUploadedEvent, FileTypes } from '@teamg2023/common';
import { File } from '../../models/file';
import { queueGroupName } from './queue-group-name';
import { Project } from '../../models/project';

export class FileUploadedListener extends Listener<FileUploadedEvent> {
    subject: Subjects.FileUploaded = Subjects.FileUploaded;
    queueGroupName = queueGroupName;

    async onMessage(data: FileUploadedEvent['data'], msg: Message) {
        const { id, userId, mimetype, encoding, type, name, projectId} = data;

        const project = await Project.findByEvent({ projectId });

        if(!project){
            throw new Error('Project not found!');
        }

        const file = File.build({
            id,
            userId,
            mimetype,
            encoding,
            type, 
            name
        });

        await file.save();

        switch(type){
            case FileTypes.ZIP:
                project.set({
                    zip_fileId: file
                });
                break;
            case FileTypes.EXTRINSIC:
                project.set({
                    extrinsic_fileId: file
                });
                break;
            case FileTypes.INTRINSIC:
                project.set({
                    intrinsic_fileId: file
                });
                break;
        }

        await project.save();

    
        msg.ack();
    }
}