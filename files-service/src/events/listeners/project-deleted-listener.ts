import { Listener, ProjectDeletedEvent, Subjects } from "@teamg2023/common";
import { Message } from "node-nats-streaming";
import { File } from "../../models/file";
import { queueGroupName } from "./queue-group-name";
import { GridFS } from "../../utils/GridFS";

export class ProjectDeletedListener extends Listener<ProjectDeletedEvent> {
    subject: Subjects.ProjectDeleted = Subjects.ProjectDeleted;

    queueGroupName = queueGroupName;

    async onMessage(data: ProjectDeletedEvent['data'], msg: Message) {
        
        const files = await File.find({
            projectId: data.projectId,
        });

        const bucket = await GridFS.getBucket();
        for(let file of files){
            await bucket.delete(file.id);
        }

        await File.deleteMany({
            projectId: data.projectId
        })

        msg.ack();
    }
}