import { BadRequestError, requireAuth, ProcessStatus } from '@teamg2023/common';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/project';
import { validateFiles } from '../utils/validateFiles';
import { ModelRunPublisher } from '../events/publishers/model-run-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/projects/run/:projectId', requireAuth, async (req: Request, res: Response) => {

    if(!req.params.projectId || !mongoose.isObjectIdOrHexString(req.params.project)){
        throw new BadRequestError('Invalid Project Id');
    }

    const project = await Project.findById(req.params.projectId).populate('zip_fileId').populate('extrinsic_fileId').populate('intrinsic_fileId');

    if(!project){
        throw new BadRequestError('Invalid Project Id');
    }

    if(!validateFiles(project)){
        throw new BadRequestError('Missing Required Files to Run Project');
    }

    new ModelRunPublisher(natsWrapper.client).publish({
        projectId: project.id,
        intri_fileId: project.intrinsic_fileId.id,
        extri_fileId: project.extrinsic_fileId.id,
        zip_fileId: project.zip_fileId.id
    })

    project.set('status', ProcessStatus.Running);

    await project.save();

    res.send( project );
})