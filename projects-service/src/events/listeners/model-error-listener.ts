import { Message } from 'node-nats-streaming';
import { Subjects , Listener, ModelErrorEvent, ProcessStatus } from '@teamg2023/common';
import { queueGroupName } from './queue-group-name';
import { Project } from '../../models/project';

export class ModelErrorListener extends Listener<ModelErrorEvent> {
    subject: Subjects.ProcessFailed = Subjects.ProcessFailed;
    queueGroupName = queueGroupName;

    async onMessage(data: ModelErrorEvent['data'] , msg: Message) {
        
        const { projectId, errors } = data;

        const project = await Project.findByEvent({ projectId });

        if(!project){
            console.log("Project Not Found!")
            msg.ack();
            return
        }

        project.set({
            processStatus: ProcessStatus.Error
        })

        await project.save();

        msg.ack();
    }
}