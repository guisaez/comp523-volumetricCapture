import { FileTypes, RunData } from '@teamg2023/common';
import fs from 'fs';
import { GridFS } from './GridFS';
import mongoose, { mongo, set } from 'mongoose';
import unzipper from 'unzipper';
import { spawn } from 'child_process';
import archiver from 'archiver';
import { File } from '../db-model/file';
import { Readable } from 'stream'
import detectCharacterEncoding from 'detect-character-encoding'
import { lookup } from 'mime-types';

export class Run {
    private userId: string;
    private projectId: string;
    private files: RunData[];

    private folderPath = './src/data/'

    constructor(projectId: string, userId: string, files: RunData[]){
        this.projectId = projectId
        this.userId =  userId
        this.files = files

        this.ensureDataFolder();
    };

    private ensureDataFolder = () => {
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath);
        }
    }

    private createProjectIdFolder = () => {
        try{
            fs.mkdirSync(this.folderPath + `${this.projectId}`)
        } catch(err){
            console.error(err);
            throw err
        } 
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

    public cleanup = (path?: string) => {
        if(!path){
            path = this.folderPath + this.projectId
        }
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
            const automation = spawn('python', [`src/scripts/automation.py`, this.projectId])
            .on('error', (err) => {
                console.log(err)
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

    private makeIntoZip = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(this.folderPath + this.projectId + "/final_output.zip");

            const archive = archiver('zip', {
                zlib: { level: 9 } //set compression level
            })

            output.on('close', () => {
                console.log(`${archive.pointer()} total bytes`);
                console.log(`archiver has been finalized and the output file descriptor has closed.`)
                resolve()
            })

            archive.on('warning', (err) => {
                if(err.code === 'ENOENT') {
                    console.warn(err);
                }else{
                    reject()
                }
            })

            archive.on('error', (err) => {
                console.log(err)
                reject()
            })

            archive.pipe(output);

            archive.directory(this.folderPath + "final_output", false)

            archive.finalize()
        })
    }

    public uploadOutput = async () => {

        try{
        const output_zip: Buffer = fs.readFileSync(this.folderPath + this.projectId + "/final_output.zip")

        const encoding = detectCharacterEncoding(output_zip)?.encoding;

        const mimetype = lookup(this.folderPath + this.projectId + "/final_output.zip").toString()

        const output_readable: Readable = Readable.from(output_zip);

        const output_zip_id = new mongoose.Types.ObjectId().toHexString();

        const output_file = File.build({
            id: output_zip_id,
            projectId: this.projectId,
            userId: this.userId,
            mimetype: mimetype,
            encoding: encoding!,
            type: FileTypes.OUTPUT,
            name: 'output.zip'
        })

        const bucket = await GridFS.getBucket();

        var uploadStream = bucket.openUploadStreamWithId(output_file._id, output_file.name);

        for await (const chunk of output_readable) {
            if (!uploadStream.write(chunk)) {
                await new Promise((resolve) => uploadStream.once('drain', resolve));
            }
        }

        uploadStream.end();

        await new Promise<void>((resolve, reject) => {
            uploadStream.on('finish', () => {
                console.log('File uploaded successfully');
                resolve();
            })
            uploadStream.on('error', (error) => {
                // There was an error during the upload
                console.error(error);
                reject(error);
            });
        });

        await output_file.save();

        return output_file;

        } catch(err: any){
            console.error(err);
            throw err;
        }finally{
            this.cleanup(this.folderPath + this.projectId);
        }
    }
   
    
    public run = async () => {

        try{
            console.log(`Creating ${this.projectId} directory...`)
            this.createProjectIdFolder();
            console.log(`${this.projectId} directory created`)
            console.log('Downloading and writing files...')
            await this.downloadAndWriteFiles();
            console.log('Files downloaded')
            console.log('Unzipping input zip...')
            await this.unzipp_data();
            console.log('Unzzip complete')
            console.log('Running model....')
            await this.pythonAutomation()
            console.log('Model Complete')
            console.log('Zipping Output Model...')
            await this.makeIntoZip()
            console.log('Zip complete')
            return true;
        }catch(err){
            console.error(err);
            this.cleanup(this.folderPath + this.projectId);
        }

        return false;
    }
}