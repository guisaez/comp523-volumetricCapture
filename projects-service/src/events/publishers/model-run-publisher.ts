import { Publisher, ModelRunEvent, Subjects } from '@teamg2023/common';

export class ModelRunPublisher extends Publisher<ModelRunEvent> {
    subject: Subjects.ProcessStarted = Subjects.ProcessStarted;
}