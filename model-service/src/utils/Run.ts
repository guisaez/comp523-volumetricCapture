import { RunData } from '@teamg2023/common';
import fs from 'fs';
import { GridFS } from './GridFS';
import mongoose from 'mongoose';
import unzipper from 'unzipper';

export class Run {
    private projectId: string;
    private files: RunData[];

    private folderPath = './src/data'

    constructor(projectId: string, files: RunData[]){
        this.projectId = projectId
        this.files = files
    };

    private ensureDataFolder = () => {
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath);
        }
    }

    private createProjectIdFolder = () => {
        fs.mkdir(this.folderPath + `${this.projectId}`, (err) => {
            throw new Error("Could not create projectId Directory");
        })
    }

    private downloadAndWriteFiles = async () => {
        for(let file of this.files){ 
            const downloadStream = (await GridFS.getBucket()).openDownloadStream(new mongoose.Types.ObjectId(file.fileId));

            const writeStream = fs.createWriteStream(this.folderPath + `${this.projectId}/${file?.name}`, { flags: 'w'});

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

    private unzipp_data = () => {
        fs.createReadStream(this.folderPath + `${this.projectId}/zip.zip`)
        .pipe(unzipper.Extract({ path: this.folderPath + `${this.projectId}/` }));
    }

    public run = async () => {

        try{
            this.ensureDataFolder();

            this.createProjectIdFolder();

            await this.downloadAndWriteFiles();

            this.unzipp_data();

            

        }catch(err){
            throw new Error('Error while running the model');
        }finally {
            this.cleanup(this.folderPath + this.projectId);
        } 
    }

}