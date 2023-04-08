import express, { Request, Response } from 'express';
import { File } from '../model/files';
import mongoose from 'mongoose';
import { BadRequestError, NotAuthorizedError } from '@teamg2023/common';
import { GridFS } from '../utils/GridFS';

const router = express.Router();

router.delete('/api/files/delete/:id', async (req: Request, res: Response) => {

    if(!req.params.id || !mongoose.isObjectIdOrHexString(req.params.id)){
        throw new BadRequestError('Invalid Id');
    }


    // const file = await File.findByIdAndDelete(req.params.id);

    const file = await File.findById(req.params.id);

    if(!file){
        throw new BadRequestError('File Not Found');
    }

    if(req.currentUser!.id !== file?.userId){
        throw new NotAuthorizedError();
    }

    try{
        await File.findByIdAndDelete(req.params.id);
        await (await GridFS.getBucket()).delete(file.id);
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