import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest} from '@teamg2023/common';
import { File } from '../models/file';
import { Readable } from 'stream';
import multer  from 'multer';
import { GridFS } from '../utils/GridFS';
import { natsWrapper } from '../nats-wrapper';
import { FileUploadedPublisher } from '../events/publishers/file-uploaded-publisher';
import mongoose from 'mongoose';
import { handleFileName } from '../utils/utils';

const router = express.Router();

const upload = multer()

router.post('/api/files/upload/:projectId',
    upload.single('file'), validateRequest,
    async (req: Request, res: Response) => {

        if(!req.params.projectId || !mongoose.isObjectIdOrHexString(req.params.projectId)){
            throw new BadRequestError('Invalid Project Id');
        }

        if(!req.file){
            throw new BadRequestError('No file uploaded');
        }

        if(!req.body.type){
            throw new BadRequestError('No file type Specified');
        }
        
        const buffer = req.file.buffer;
        const readable = Readable.from(buffer);

        const bucket = await GridFS.getBucket();

        const file = File.build({
            userId: req.currentUser!.id,
            mimetype: req.file.mimetype,
            encoding: req.file.encoding,
            name: req.file.originalname,
            type: req.body.type,
            projectId: req.params.projectId
        });

        const file_name = handleFileName(file.type);

        const uploadStream = bucket.openUploadStreamWithId(file._id, file_name);

        uploadStream.on('error', (err) => {
           res.status(500).send( err );
        });

        for await (const chunk of readable) {
            if (!uploadStream.write(chunk)) {
                await new Promise((resolve) => uploadStream.once('drain', resolve));
            }
        }
            
        uploadStream.end();

        await file.save();

        new FileUploadedPublisher(natsWrapper.client).publish({
            id: file.id,
            version: file.version,
            type: file.type,
            userId: file.userId,
            name: file.name,
            projectId: req.params.projectId
        });

        res.status(200).send({ file: file })
        
    })

export { router as UploadFileRouter };