import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth } from '@teamg2023/common';
import { Project } from '../models/project';

const router = express.Router();

router.delete('/api/projects', requireAuth, async (req: Request, res: Response) => {

    await Project.deleteMany({
        userId: req.currentUser!.id
    })

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

    res.status(204).send({});
})

export { router as projectDeleteRouter }