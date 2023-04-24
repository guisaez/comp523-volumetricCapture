import { Listener, ModelRunEvent, Subjects } from "@teamg2023/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { model_run_queue } from "../../queue/run-queue";
import { ModelCompletePublisher } from "../publishers/model-complete-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ModelRunListener extends Listener<ModelRunEvent> {
    subject: Subjects.ProcessStarted = Subjects.ProcessStarted;
    queueGroupName = queueGroupName;

    async onMessage(data: ModelRunEvent['data'], msg: Message) {

       await model_run_queue.add({
        projectId: data.projectId,
        files: data.files,
        userId: data.userId,
       })

       msg.ack();
    }
}