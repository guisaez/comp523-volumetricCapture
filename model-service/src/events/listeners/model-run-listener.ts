import { Listener, ModelRunEvent, RunData, Subjects } from "@teamg2023/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import fs from 'fs';
import { GridFS } from "../../utils/GridFS";
import mongoose from "mongoose";
import unzipper from 'unzipper';
import { ModelCompletePublisher } from "../publishers/model-complete-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { ModelErrorPublisher } from "../publishers/model-error-publisher";

export class ModelRunListener extends Listener<ModelRunEvent> {
    subject: Subjects.ProcessStarted = Subjects.ProcessStarted;
    queueGroupName = queueGroupName;

    private folderPath = './src/temp/';

    async onMessage(data: ModelRunEvent['data'], msg: Message) {

        // Ensure temp folder is created!
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath);
        }

        // Make projectId folder
        fs.mkdir(this.folderPath + `${data.projectId}`, async (err) => {
            if(err) {
                this.handleErrors(data.projectId, err);
                msg.ack();
                return this.cleanup(this.folderPath + `${data.projectId}`);
            }
        })

           
        await this.downloadAndWriteFiles(data.files, data.projectId);
        
        msg.ack();

        fs.createReadStream(this.folderPath + `${data.projectId}/zip.zip`)
        .pipe(unzipper.Extract({ path: this.folderPath + `${data.projectId}/input/` }));

        
        setTimeout(async () => {
            this.cleanup(this.folderPath + `${data.projectId}`);

            new ModelCompletePublisher(natsWrapper.client).publish({
                projectId: data.projectId,
                output_fileId: new mongoose.Types.ObjectId().toHexString() // this will be the fileId of the update zip file.
            })
        }, 5000)
    }

    private downloadAndWriteFiles = async (files: RunData[], projectId: string) => {
        for(let file of files){ 
            const downloadStream = (await GridFS.getBucket()).openDownloadStream(new mongoose.Types.ObjectId(file.fileId));

            const writeStream = fs.createWriteStream(this.folderPath + `${projectId}/${file?.name}`, { flags: 'w'});

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

    private handleErrors = (projectId: string, err: Error): Promise<void> => {
        return new ModelErrorPublisher(natsWrapper.client).publish({
            projectId: projectId,
            errors: [err.message]
        })
    }
    
}