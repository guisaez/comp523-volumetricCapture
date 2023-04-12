import { FileTypes, ModelRunEvent, RunData } from "@teamg2023/common";
import { natsWrapper } from "../../../nats-wrapper"
import { ModelRunListener } from "../model-run-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { File } from '../../../models/file';
import fs from 'fs';
import { GridFS } from "../../../utils/GridFS";
import { Readable } from "stream";

const zipFileData: Readable= Readable.from(fs.readFileSync('./src/events/listeners/__test__/test_files/raw_images_zip.zip'));
const extriFileData: Readable= Readable.from(fs.readFileSync('./src/events/listeners/__test__/test_files/test.yml'));
const intriFileData: Readable = Readable.from(fs.readFileSync('./src/events/listeners/__test__/test_files/test2.yml'));

const setup = async () => {
    const listener = new ModelRunListener(natsWrapper.client);

    const projectId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();

    const zipFile = File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        projectId: projectId,
        userId: userId,
        encoding: 'zip',
        mimetype: 'zip',
        name: 'raw_images_zip.zip',
        type: FileTypes.ZIP
    })

    const intriFile = File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        projectId: projectId,
        userId: userId,
        encoding: 'zip',
        mimetype: 'zip',
        name: 'raw_images_zip.zip',
        type: FileTypes.ZIP
    })

    const extriFile = File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        projectId: projectId,
        userId: userId,
        encoding: 'zip',
        mimetype: 'zip',
        name: 'raw_images_zip.zip',
        type: FileTypes.ZIP
    })

    const bucket = await GridFS.getBucket();

    // Upload Zip File
    var uploadStream = bucket.openUploadStreamWithId(zipFile._id, zipFile.name);

    for await (const chunk of zipFileData) {
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
            console.log(error);
            reject(error);
        });
    });

    await zipFile.save();

    // Upload Intrinsic File

    uploadStream = bucket.openUploadStreamWithId(intriFile._id, zipFile.name);

    for await (const chunk of intriFileData) {
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
            console.log(error);
            reject(error);
        });
    });

    await intriFile.save();

    // Upload Extrinsic File

    uploadStream = bucket.openUploadStreamWithId(extriFile._id, zipFile.name);

    for await (const chunk of extriFileData) {
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
            console.log(error);
            reject(error);
        });
    });

    await extriFile.save();

    const data: ModelRunEvent['data'] = {
        projectId: projectId,
        files: [
            {
                fileId: zipFile.id,
                name: 'zip.zip',
                type: zipFile.type
            },
            {
                fileId: extriFile.id,
                name: 'extrinsic.yml',
                type: extriFile.type
            },
            {
                fileId: intriFile.id,
                name: 'intrinsic.yml',
                type: intriFile.type
            }
        ]
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg, listener }
}  

it('automation test', async () => {

    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
})