import { Listener, ModelRunEvent, RunData, Subjects } from "@teamg2023/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import fs from 'fs';
import { GridFS } from "../../utils/GridFS";
import mongoose from "mongoose";

export class ModelRunListener extends Listener<ModelRunEvent> {
    subject: Subjects.ProcessStarted = Subjects.ProcessStarted;
    queueGroupName = queueGroupName;

    async onMessage(data: ModelRunEvent['data'], msg: Message) {

        fs.mkdir(`./src/temp/${data.projectId}`, (err) => {
            if(err) {
                console.log(err);
            } else{
                console.log(`Folder for projectId ${data.projectId} created!`)
            }
        })
        
        await this.downloadAndWriteFiles(data.files, data.projectId);

        msg.ack();
    }

    private downloadAndWriteFiles = async (files: RunData[], projectId: string) => {
        for(let file of files){ 
            console.log(file.fileId)
            const downloadStream = (await GridFS.getBucket()).openDownloadStream(new mongoose.Types.ObjectId(file.fileId));

            const writeStream = fs.createWriteStream(`./src/temp/${projectId}/${file?.name}`, { flags: 'w'});

            await this.downloadAndWrite(downloadStream, writeStream);
        }
       
    }

    private downloadAndWrite = (downloadStream: mongoose.mongo.GridFSBucketReadStream, writeStream: fs.WriteStream):Promise<void> => {
        return new Promise((resolve, reject) => {
            downloadStream.pipe(writeStream)
                .on('finish', () => {
                    resolve();
                })
                .on('error', (error) => {
                    console.log(error);
                    reject(error);
                })
        })
    }
}