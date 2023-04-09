import { requireAuth } from '@teamg2023/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Project } from '../models/project';

const router = express.Router();

router.post('/api/projects', requireAuth, [
    body('projectName')
        .not()
        .isEmpty()
        .withMessage('Project Name cannot be empty')
], async (req: Request, res: Response ) => {

    const { projectName } = req.body;

    const project = Project.build({
        projectName: projectName,
        userId: req.currentUser!.id,
    })

    await project.save();

    res.status(201).send(project);
})

export { router as projectNewRouter };