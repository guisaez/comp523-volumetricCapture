import { Subjects } from "./subjects";
import { FileTypes } from "./types/file-types";

export interface FileUpdatedEvent {
    subject: Subjects.FileUpdated;

    data: {
        id: string,
        version: number,
        userId: string,
        type: FileTypes,
        name: string;
    }
}