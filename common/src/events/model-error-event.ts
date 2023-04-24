import { Subjects } from "./subjects";

export interface ModelErrorEvent {
    subject: Subjects.ProcessFailed;

    data: {
        projectId: string,
        errors: string[],
    }
}