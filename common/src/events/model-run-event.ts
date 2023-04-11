import { Subjects } from "./subjects";

export interface ModelRunEvent {
    subject: Subjects.ProcessStarted;

    data: {
        projectId: string,
        zip_fileId: string,
        intri_fileId: string,
        extri_fileId: string
    }
}