import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth } from '@teamg2023/common';
import { Project } from '../models/project';
import { ProjectDeletedPublisher } from '../events/publishers/project-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/projects', requireAuth, async (req: Request, res: Response) => {

    const deleted = await Project.deleteMany({
        userId: req.currentUser!.id
    })

    console.log(deleted);

    res.status(204).send({});
})
    
router.delete('/api/projects/:id', requireAuth, async (req:Request, res: Response) => {

    if(!req.params.id){
        throw new BadRequestError('Invalid id');
    }

    const deleted = await Project.findByIdAndDelete(req.params.id);

    if(!deleted){
        throw new BadRequestError('Project not found');
    }

    new ProjectDeletedPublisher(natsWrapper.client).publish({
        projectId:  deleted.id,
        userId: deleted.userId
    });

    res.status(204).send({});
})

export { router as projectDeleteRouter }