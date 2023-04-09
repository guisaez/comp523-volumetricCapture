import express, { Request, Response } from 'express';
import { File } from '../models/file';

const router = express.Router();

router.get('/api/files', async (req: Request, res: Response) => {
    const files = await File.find({
        userId: req.currentUser!.id
    })

    res.status(200).send(files);
});

export { router as IndexFiles }