import { Subjects } from "./subjects";
import { FileTypes } from "./types/file-types";

export interface ModelRunEvent {
    subject: Subjects.ProcessStarted;

    data: {
        files: [
            {
                fileId: string,
                name: string,
                type: FileTypes
            }
        ]
    }
}