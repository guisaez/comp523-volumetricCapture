import { Subjects } from "./subjects";
import { FileTypes } from "./types/file-types";

export interface FileUploadedEvent {
    subject: Subjects.FileUploaded;

    data: {
        id: string,
        version: number,
        userId: string,
        type: FileTypes,
        name: string;
        projectId: string;
    }
}