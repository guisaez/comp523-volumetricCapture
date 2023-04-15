import express, { Request, Response } from 'express';
import { Project } from '../models/project';
import mongoose from 'mongoose';
import { BadRequestError, requireAuth, validateRequest } from '@teamg2023/common';
import { body } from 'express-validator';

const router = express.Router();

router.patch('/api/projects/:id', requireAuth, [
    body('projectName')
        .isString()
        .isLength({
            min: 1
        })
        .not()
        .isEmpty()
        .withMessage('Project Name cannot be empty')
], validateRequest, async (req: Request, res: Response ) => {
    if(!mongoose.isObjectIdOrHexString(req.params.id)){
        throw new BadRequestError('Invalid Project Id');
    }

const { projectName } = req.body;
const projectId = req.params.id;

// Update the project's name
const updatedProject = await Project.findByIdAndUpdate(
  projectId,
  { projectName },
  { new: true } // Set { new: true } to return the updated project
);

if (!updatedProject) {
  throw new BadRequestError('Project Not Found');
}

res.status(200).send(updatedProject);
})

export { router as projectUpdateRouter };