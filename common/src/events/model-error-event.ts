import { Subjects } from "./subjects";

export interface ModelErrorEvent {
    subject: Subjects.ProcessFailed;

    data: {
        projectId: string,
        version: number;
        errors: string[],
    }
}