import { Subjects } from "./subjects";

export interface ModelCompleteEvent {
    subject: Subjects.ProcessComplete;

    data: {
        projectId: string
    }
}