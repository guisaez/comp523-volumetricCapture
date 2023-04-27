import { ProjectDoc } from "../models/project"

export const validateFiles = (project: ProjectDoc) => {
    return project.zip_fileId && project.intrinsic_fileId && project.extrinsic_fileId && project.multi_view_fileId;
}