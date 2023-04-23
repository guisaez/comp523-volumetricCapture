import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { File } from '../models/file';
import { BadRequestError } from '@teamg2023/common';

const router = express.Router();

router.get('/api/files', async (req: Request, res: Response) => {
    const files = await File.find({
        userId: req.currentUser!.id
    })

    res.status(200).send( { files : files } );
});

router.get('/api/files/:id', async (req: Request, res: Response) => {
    if(!mongoose.isObjectIdOrHexString(req.params.id)){
        throw new BadRequestError('Invalid File Id');
    }

    const file = await File.findById(req.params.id);

    if(!file){
        throw new BadRequestError('File Not Found')
    }

    res.status(200).send( { file: file });
})

export { router as IndexFiles }