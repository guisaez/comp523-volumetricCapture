import express, { Request, Response} from 'express';
import multer from 'multer';
import { File } from '../model/files';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@teamg2023/common';
import mongoose, { mongo } from 'mongoose';
import { Readable } from 'stream';
import { GridFS } from '../utils/GridFS';
import { FileUpdatedPublisher } from '../events/publishers/file-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const upload = multer();

router.put('/api/files/update/:id',
    upload.single('file'),
    async (req: Request, res: Response) => {

        const { type } = req.body;

        if(!req.params.id && !mongoose.isObjectIdOrHexString(req.params.id)){
            throw new BadRequestError('Invalid File Id');
        }

        if(!type){
            throw new BadRequestError('Type must be defined');
        }

        if(!req.file){
            throw new BadRequestError('File must be defined');
        }

        const file = await File.findByIdAndType({
            id: req.params.id,
            type: type
        });

        if(!file){
            throw new BadRequestError('File Not Found');
        }

        if(file.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        const buffer = req.file.buffer;
        const readable = Readable.from(buffer);

        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const bucket = await GridFS.getBucket();

        const uploadStream = bucket.openUploadStreamWithId(fileId, req.file.originalname);

        file.set({
            name: req.file.originalname,
            mimetype: req.file.mimetype,
            encoding: req.file.encoding,
        })

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
        
        new FileUpdatedPublisher(natsWrapper.client).publish({
            id: file.id,
            version: file.version,
            type: file.type,
            name: file.name,
            userId: file.userId
        });

        res.status(200).send( { file: file });
});

export { router as UpdateFileRouter };

