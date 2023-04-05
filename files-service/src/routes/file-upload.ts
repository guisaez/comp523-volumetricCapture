import express, { Request, Response } from 'express';
import { BadRequestError} from '@teamg2023/common';
import { File } from '../model/files';
import { Readable } from 'stream';
import multer  from 'multer';
import mongoose from 'mongoose';
import { GridFS } from '../utils/GridFS';

const router = express.Router();

const upload = multer()

router.post('/api/files/upload',
    upload.single('file'),
    async (req: Request, res: Response) => {

        if(!req.file){
            throw new BadRequestError('No file uploaded');
        }

        if(!req.body.type){
            throw new BadRequestError('No file type Specified');
        }
        
        const buffer = req.file.buffer;
        const readable = Readable.from(buffer);

        const bucket = await GridFS.getBucket();

        const uploadStream = bucket.openUploadStream(req.file.originalname);

        const file = File.build({
            userId: req.currentUser!.id,
            mimetype: req.file.mimetype,
            encoding: req.file.encoding,
            name: req.file.originalname,
            type: req.body.type,
        });

        
        try{
            for await (const chunk of readable) {
                if (!uploadStream.write(chunk)) {
                    await new Promise((resolve) => uploadStream.once('drain', resolve));
                }
            }
            
            uploadStream.end();

            await file.save();
        } catch (err: any) {
            res.status(500).send({ message: err.message })
        }

        res.status(200).send({ file: file })
        
    })

export { router as UploadFileRouter };