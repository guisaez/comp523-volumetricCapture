import { Publisher, Subjects, ModelErrorEvent } from '@teamg2023/common';

export class ModelErrorPublisher extends Publisher<ModelErrorEvent> {
    subject: Subjects.ProcessFailed = Subjects.ProcessFailed;
}