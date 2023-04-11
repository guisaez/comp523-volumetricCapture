import { BadRequestError, currentUser } from "@teamg2023/common";
import express, { Request, Response } from 'express'
import mongoose from "mongoose";
import { File } from "../models/file";
import { validateFiles } from "../utils/validateFiles";

const router = express.Router();

router.post('/api/model/run/:projectId', currentUser, async (req: Request, res: Response) => {

    if(!req.params.projectId || !mongoose.isObjectIdOrHexString(req.params.projectId)){
        throw new BadRequestError('Ivalid Project ID');
    }

    const files = await File.find({
        projectId: req.params.projectId
    })

    if(files.length === 0){
        throw new BadRequestError('Project Id not Found!')
    }

    if(!validateFiles(files)){
        throw new BadRequestError('Not All Setup Files Are uploaded');
    }

    

    res.send({files: files})
})

export { router as modelRunRouter };