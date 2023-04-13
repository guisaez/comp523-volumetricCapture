import { Publisher, Subjects, ModelCompleteEvent } from "@teamg2023/common";

export class ModelCompletePublisher extends Publisher<ModelCompleteEvent> {
    subject: Subjects.ProcessComplete = Subjects.ProcessComplete;
}