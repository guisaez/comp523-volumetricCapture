import { BadRequestError, requireAuth, ProcessStatus, RunData } from '@teamg2023/common';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/project';
import { validateFiles } from '../utils/validateFiles';
import { ModelRunPublisher } from '../events/publishers/model-run-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/projects/run/:projectId', requireAuth, async (req: Request, res: Response) => {

    if(!req.params.projectId || !mongoose.isObjectIdOrHexString(req.params.projectId)){
        throw new BadRequestError('Invalid Project Id');
    }
    const project = await Project.findById(req.params.projectId).populate('zip_fileId').populate('extrinsic_fileId').populate('intrinsic_fileId').populate('multi_view_fileId');

    if(!project){
        throw new BadRequestError('Invalid Project Id');
    }

    if(!validateFiles(project)){
        throw new BadRequestError('Missing Required Files to Run Project');
    }

    const zipData: RunData = {
        fileId: project.zip_fileId.id,
        name: 'zip.zip',
        type: project.zip_fileId.type
    }

    const intrinsicData: RunData = {
        fileId: project.intrinsic_fileId.id,
        name: 'intri.yml',
        type: project.intrinsic_fileId.type
    }

    const extrinsicData: RunData = {
        fileId: project.intrinsic_fileId.id,
        name: 'extri.yml',
        type: project.extrinsic_fileId.type
    }

    const multiConfigData: RunData = {
        fileId: project.multi_view_fileId.id,
        name: 'multi_config_custom.yml',
        type: project.multi_view_fileId.type
    }

    project.set('processStatus', ProcessStatus.Running);

    await project.save();

    new ModelRunPublisher(natsWrapper.client).publish({
        projectId: project.id,
        userId: project.userId,
        files: [intrinsicData, zipData, extrinsicData, multiConfigData]
    })

    res.send( { project });
})

export { router as runProjectRouter };