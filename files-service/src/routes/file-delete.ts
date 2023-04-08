import express, { Request, Response } from 'express';
import { File } from '../model/files';
import mongoose from 'mongoose';
import { BadRequestError, NotAuthorizedError } from '@teamg2023/common';
import { GridFS } from '../utils/GridFS';
import { FileDeletedPublisher } from '../events/publishers/file-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';
import { body } from 'express-validator';

const router = express.Router();

router.delete('/api/files/delete', [
    body('projectId')
        .not()
        .isEmpty(),
    body('id')
        .not()
        .isEmpty()
], async (req: Request, res: Response) => {

    const { projectId, id } = req.body;

    if(!mongoose.isObjectIdOrHexString(projectId) ||!mongoose.isObjectIdOrHexString(id)){
        throw new BadRequestError('Invalid projectId of id');
    }

    // const file = await File.findByIdAndDelete(req.params.id);

    const file = await File.findById(id);

    if(!file){
        throw new BadRequestError('File Not Found');
    }

    if(req.currentUser!.id !== file?.userId){
        throw new NotAuthorizedError();
    }

    try{
        await File.findByIdAndDelete(id);
        await (await GridFS.getBucket()).delete(file.id);

        new FileDeletedPublisher(natsWrapper.client).publish({
            id: id,
            projectId: projectId,
        });
        
    } catch (err) {
        console.log(err);
    }
    
    res.status(204).send();
})

router.delete('/api/files/delete-all/:userId', async (req: Request, res: Response) => {

    if(!req.params.userId || !mongoose.isObjectIdOrHexString(req.params.userId)){
        throw new BadRequestError('Invalid Id');
    }

    if(req.params.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    const files = await File.find({
        userId: req.params.userId
    })

    const bucket = await GridFS.getBucket();

    
    for await (let file of files){
        await bucket.delete(file.id);
    }

    await File.deleteMany({
        userId: req.params.userId
    })

    res.status(204).send();
    
})

export { router as DeleteFileRouter }