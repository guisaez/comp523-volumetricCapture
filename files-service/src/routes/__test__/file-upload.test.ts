import request from 'supertest';
import fs from 'fs';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

const fileData : Buffer = fs.readFileSync('./src/routes/__test__/test_files/test.yml');
const zipData: Buffer =  fs.readFileSync('./src/routes/__test__/test_files/raw_images_zip.zip');

it('returns a 401 Unauthorized if the user is not authenticated', async () => {
    const projectId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/files/upload/${projectId}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', fileData, { filename: 'test.yml'})
        .field({
            type: "intrinsic"
        })
        .expect(401);
});

it('returns a 404 if no project id is provided or 400 if invalid projectId', async () => {
    await request(app)
        .post('/api/files/upload/')
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', global.signin())
        .attach('file', fileData, { filename: 'test.yml'})
        .field({
            type: "intrinsic"
        })
        .expect(404);
    
    await request(app)
        .post('/api/files/upload/1223ssdf')
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', global.signin())
        .attach('file', fileData, { filename: 'test.yml'})
        .field({
            type: "intrinsic"
        })
        .expect(400);
})

it('returns a 400 if type of file is not specified', async () => {
    const projectId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/files/upload/${projectId}`)
        .set('Cookie', global.signin())
        .set('Content-Type', 'multipart/form-data')
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(400)
});

it('returns a 400 if file is not attached', async () => {
    const projectId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/files/upload/${projectId}`)
        .set('Cookie', global.signin())
        .set('Content-Type', 'multipart/form-data')
        .field({
            type: "intrinsic"
        })
        .expect(400)
});

it('successfully uploads the file', async () => {
    const projectId = new mongoose.Types.ObjectId().toHexString();

    const fileResponse = await request(app)
        .post(`/api/files/upload/${projectId}`)
        .set('Cookie', global.signin())
        .set('Content-Type', 'multipart/form-data')
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    expect(fileResponse.body.file.name!).toEqual('test.yml');
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // Upload a Zip file

    const fileResponse2 = await request(app)
        .post(`/api/files/upload/${projectId}`)
        .set('Cookie', global.signin())
        .set('Content-Type', 'multipart/form-data')
        .attach('file', zipData, { filename: 'raw_images_zip.zip'})
        .field({
            type: "zip"
        })
        .expect(200)

    expect(fileResponse2.body.file.name!).toEqual('raw_images_zip.zip');
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})