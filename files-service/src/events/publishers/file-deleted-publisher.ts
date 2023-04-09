import { Publisher, Subjects, FileDeletedEvent } from "@teamg2023/common";

export class FileDeletedPublisher extends Publisher<FileDeletedEvent> {
    subject: Subjects.FileDeleted = Subjects.FileDeleted;
}