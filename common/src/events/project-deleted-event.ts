import { Subjects } from "./subjects";

export interface ProjectDeletedEvent {
    subject: Subjects.ProjectDeleted;

    data: {
        projectId: string,
        userId: string,
    }
}