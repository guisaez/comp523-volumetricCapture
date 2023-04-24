import { ModelCompleteEvent, Listener, Subjects, ProcessStatus } from "@teamg2023/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { Project } from "../../models/project";
import  { File } from '../../models/file';

export class ModelCompleteListener extends Listener<ModelCompleteEvent> {
    subject: Subjects.ProcessComplete = Subjects.ProcessComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ModelCompleteEvent['data'], msg: Message) {
        const { projectId, file} = data;

        const project = await Project.findByEvent({projectId});

        if(!project){
            console.log('Project not Found!');
            msg.ack()
            return
        }

        const new_file = File.build({
            id: file.id, 
            userId: file.userId, 
            type: file.type, 
            name: file.name
        })

        await new_file.save()

        project.set({
            output_fileId: new_file.id,
            processStatus: ProcessStatus.Completed
        });

        await project.save();

        msg.ack();
    }
}   