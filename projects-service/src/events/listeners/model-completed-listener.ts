import { ModelCompleteEvent, Listener, Subjects, ProcessStatus } from "@teamg2023/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { Project } from "../../models/project";

export class ModelCompleteListener extends Listener<ModelCompleteEvent> {
    subject: Subjects.ProcessComplete = Subjects.ProcessComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ModelCompleteEvent['data'], msg: Message) {
        const { projectId, output_fileId } = data;

        const project = await Project.findByEvent({projectId});

        if(!project){
            throw new Error('Project not Found!');
        }

        project.set('processStatus', ProcessStatus.Completed);

        if(output_fileId){
            project.set('output_fileId', output_fileId);
        }

        await project.save();

        msg.ack();
    }
}   