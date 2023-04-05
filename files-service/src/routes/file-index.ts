import express, { Request, Response } from 'express';
import { File } from '../model/files';

const router = express.Router();

router.get('/api/files', async (req: Request, res: Response) => {
    const files = await File.find({
        userId: req.currentUser!.id
    })

    res.status(200).send(files);
});

export { router as IndexFiles }