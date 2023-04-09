import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { GridFS } from '../utils/GridFS';
import { BadRequestError, NotAuthorizedError, errorHandler, requireAuth } from '@teamg2023/common';
import { File } from '../models/file';

const router = express.Router();

router.get('/api/files/download/:id', async (req: Request, res: Response) => {

    if(!req.params.id || !mongoose.isObjectIdOrHexString(req.params.id)){
        throw new BadRequestError('Invalid file Id');
    }

    const file = await File.findById(req.params.id);

    if(req.currentUser!.id !== file?.userId){
        throw new NotAuthorizedError();
    }

    if(!file){
        return new BadRequestError('File Not Found!');
    }

    const bucket = await GridFS.getBucket();
    
    const downloadStream = bucket.openDownloadStream(file.id);

    res.set('Content-Type', file.mimetype);
    res.set('Content-Disposition', `attachment; filename="${file.name}`);

    downloadStream.pipe(res);
})

export { router as DownloadFilesRouter };
