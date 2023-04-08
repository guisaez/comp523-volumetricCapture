import { Subjects } from "./subjects";
import { FileTypes } from "./types/file-types";

export interface FileUpdatedEvent {
    subject: Subjects.FileUpdated;

    data: {
        id: string,
        version: number,
        userId: string,
        mimetype: string,
        encoding: string,
        type: FileTypes,
        name: string;
    }
}