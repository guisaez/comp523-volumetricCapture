import { RunData } from '@teamg2023/common';
import fs from 'fs';
import { GridFS } from './GridFS';
import mongoose, { set } from 'mongoose';
import unzipper from 'unzipper';
import { spawn } from 'child_process';

export class Run {
    private projectId: string;
    private files: RunData[];

    private folderPath = './src/data/'

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
            console.log("There is an error")
        })
    }

    private downloadAndWriteFiles = async () => {
        for(let file of this.files){ 
            const downloadStream = (await GridFS.getBucket()).openDownloadStream(new mongoose.Types.ObjectId(file.fileId));
            
            const writeStream = fs.createWriteStream(this.folderPath + this.projectId + "/" + file?.name, { flags: 'w'});

            writeStream.on('end', () => {
                console.log(`WriteStream for file ${file.name}`);
                writeStream.close()
            })

            writeStream.on('error', (err) => {
                console.log(err);
                writeStream.destroy();
            })

            downloadStream.on('end', () => {
                console.log(`Download Stream for ${file.name} ended`);
            })
            
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

    private unzipp_data = ():Promise<void> => {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(this.folderPath + `${this.projectId}/zip.zip`)
                .on('error', (err) => {
                    console.error(`Error reading zip file: ${err.message}`)
                    reject(err)
                })
                .pipe(unzipper.Extract({path: this.folderPath + this.projectId + `/` }))
                .on('error', (err) => {
                    console.error(`Error unzipping data: ${err.message}`);
                    reject(err);
                })
                .on('close', () => {
                    console.log('Data unzipped successfully');
                    resolve();
                });
        })
    }

    private pythonAutomation = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const automation = spawn('python', ['./src/scripts/test_dummy.py'])
            .on('error', (err) => {
                reject(err)
            })

            automation.stdout.on('data', (data) => {
                console.log('Automation Data:');
                console.log(data.toString())
            })

            automation.stderr.on('data', (data) => {
                // Pipe any errors from the Python script to the console
                console.log(`Python error: ${data}`);
            });

            automation.on('close', (code) => {
                if(code === 0){
                    resolve();
                }else{
                    reject(`Python script exited with code ${code}`)
                }
            })
        })
    }
    
    public run = async () => {

        try{
            this.ensureDataFolder();

            this.createProjectIdFolder();

            await this.downloadAndWriteFiles();

            await this.unzipp_data();

            await this.pythonAutomation()
            
        }catch(err){
            console.error("Error");
        }finally {
            console.log("Cleaning up");
            this.cleanup(this.folderPath + this.projectId);
        } 
    }
}