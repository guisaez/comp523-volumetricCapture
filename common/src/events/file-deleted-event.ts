import { Subjects } from "./subjects";

export interface FileDeletedEvent {
    subject: Subjects.FileDeleted;

    data: {
        id: string;
        projectId: string;
    }
    
}