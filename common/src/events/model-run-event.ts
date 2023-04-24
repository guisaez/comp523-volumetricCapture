import { Subjects } from "./subjects";
import { FileTypes } from "./types/file-types";

export interface RunData {
        fileId: string;
        name: string;
        type: FileTypes;
}

export interface ModelRunEvent {
    subject: Subjects.ProcessStarted;

    data: {
        projectId: string,
        userId: string,
        files: RunData[];
    }
}