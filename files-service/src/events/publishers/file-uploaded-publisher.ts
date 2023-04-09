import { Publisher, Subjects, FileUploadedEvent } from "@teamg2023/common";

export class FileUploadedPublisher extends Publisher<FileUploadedEvent> {
    subject: Subjects.FileUploaded = Subjects.FileUploaded;
}