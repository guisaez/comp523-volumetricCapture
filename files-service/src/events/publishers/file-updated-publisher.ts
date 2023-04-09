import { Publisher, Subjects, FileUpdatedEvent } from "@teamg2023/common";

export class FileUpdatedPublisher extends Publisher<FileUpdatedEvent> {
    subject: Subjects.FileUpdated = Subjects.FileUpdated;
}