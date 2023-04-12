import { Listener, ModelRunEvent, RunData, Subjects } from "@teamg2023/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import fs from 'fs';
import { GridFS } from "../../utils/GridFS";
import mongoose from "mongoose";
import unzipper from 'unzipper';

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

        msg.ack();
        
        await this.downloadAndWriteFiles(data.files, data.projectId);

        
        fs.createReadStream(`./src/temp/${data.projectId}/zip.zip`)
        .pipe(unzipper.Extract({ path: `./src/temp/${data.projectId}/input/` }));

        
        setTimeout(() => {
            this.cleanup(`./src/temp/${data.projectId}`);
        }, 5000)
       
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

    private cleanup = (path: string) => {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file) => {
              const curPath = `${path}/${file}`;
              if (fs.lstatSync(curPath).isDirectory()) {
                // Recursive call
                this.cleanup(curPath);
              } else {
                // Delete file
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(path);
          }
    }
    
}