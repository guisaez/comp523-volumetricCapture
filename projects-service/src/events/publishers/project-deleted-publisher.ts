import { Publisher, ProjectDeletedEvent, Subjects } from '@teamg2023/common';

export class ProjectDeletedPublisher extends Publisher<ProjectDeletedEvent> {
    subject: Subjects.ProjectDeleted = Subjects.ProjectDeleted;
}