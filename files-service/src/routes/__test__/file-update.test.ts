import request from 'supertest';
import fs from 'fs';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

const fileData : Buffer = fs.readFileSync('./src/routes/__test__/test_files/test.yml');
const updatedFileData: Buffer = fs.readFileSync('./src/routes/__test__/test_files/test2.yml');

it('returns a 400 if file is not provided', async () => {
   const cookie = global.signin();
   
    const res = await request(app)
        .post(`/api/files/upload/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    const fileId = res.body.file.id;

    await request(app)
        .put(`/api/files/update/${fileId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field({
            type: "intrinsic"
        })
        .expect(400);
});

it('returns a 400 if type is not provided', async () => {
    const cookie = global.signin();
   
    const res = await request(app)
        .post(`/api/files/upload/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    const fileId = res.body.file.id;

    await request(app)
        .put(`/api/files/update/${fileId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(400);
});


it('returns 404 NotFound if file type is not the same as stored type', async () => {
    const cookie = global.signin();

    const res = await request(app)
        .post(`/api/files/upload/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    const fileId = res.body.file.id;

    await request(app)
        .put(`/api/files/${fileId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .attach('file', fileData, { filename: 'test.yml'})
        .field({
            type: "extrinsic"
        })
        .expect(404);
    
});


it('successfully updates the file', async () => {
    const cookie = global.signin();

    const res = await request(app)
        .post(`/api/files/upload/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    const fileId = res.body.file.id;

    const updatedRes = await request(app)
        .put(`/api/files/update/${fileId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .attach('file', updatedFileData, { filename: 'test2.yml'})
        .field({
            type: "intrinsic"
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    expect(updatedRes.body.file.id).toEqual(fileId);
    expect(updatedRes.body.file.userId).toEqual(res.body.file.userId);
    expect(updatedRes.body.file.type).toEqual(res.body.file.type);
});