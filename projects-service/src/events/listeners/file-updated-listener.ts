import { Message } from 'node-nats-streaming';
import { Subjects, Listener, FileUpdatedEvent } from '@teamg2023/common';
import { File } from '../../models/file';
import { queueGroupName } from './queue-group-name';

export class FileUpdatedListener extends Listener<FileUpdatedEvent> {
    subject: Subjects.FileUpdated = Subjects.FileUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: FileUpdatedEvent['data'], msg: Message) {
        

        const file = await File.findByEvent(data);

        if(!file){
            throw new Error('File Not Found');
        }

        const { mimetype, encoding, name, type } = data;

        file.set({ mimetype, encoding, name, type });
        
        await file.save();

        msg.ack();
    }
}