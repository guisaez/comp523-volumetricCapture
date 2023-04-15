import { requireAuth, validateRequest } from '@teamg2023/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Project } from '../models/project';

const router = express.Router();

router.post('/api/projects', requireAuth, [
    body('projectName')
        .isString()
        .isLength({
            min: 1
        })
        .not()
        .isEmpty()
        .withMessage('Project Name cannot be empty')
], validateRequest, async (req: Request, res: Response ) => {

    const { projectName } = req.body;

    const project = Project.build({
        projectName: projectName,
        userId: req.currentUser!.id,
        createdAt: new Date()
    })

    await project.save();

    res.status(201).send(project);
})

export { router as projectNewRouter };