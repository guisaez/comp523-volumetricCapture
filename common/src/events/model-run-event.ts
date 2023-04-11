import { Subjects } from "./subjects";

export interface ModelRunEvent {
    subject: Subjects.ProcessStarted;

    data: {
        projectId: string,
    }
}