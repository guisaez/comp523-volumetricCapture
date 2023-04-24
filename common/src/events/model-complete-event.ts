import { Subjects } from "./subjects";
import { FileTypes } from "./types/file-types";

export interface ModelCompleteEvent {
    subject: Subjects.ProcessComplete;

    data: {
        projectId: string,
        file: {
            id: string,
            version: number,
            userId: string,
            type: FileTypes,
            name: string;
        }
    }
}