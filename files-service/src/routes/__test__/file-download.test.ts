import request from "supertest";
import { app } from '../../app';
import fs from 'fs';
import mongoose from "mongoose";

const fileData : Buffer = fs.readFileSync('./src/routes/__test__/test_files/test.yml');

const uploadFile = async ( cookie: string[] ) => {

    const res = await request(app)
        .post(`/api/files/upload/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', cookie)
        .set('Content-Type', 'multipart/form-data')
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200)

    return res.body.file;
}

it('downloads the file', async () => {
    const cookie = global.signin();

    const { id } = await uploadFile(cookie);
    
    const res = await request(app)
        .get(`/api/files/download/${id}`)
        .set('Cookie', cookie)
        .expect(200);

});

it('return 401 not Authorized if tries to retrieve other users files', async () => {
    const user1 = global.signin();

    const { id } = await uploadFile(user1);

    await request(app)
        .get(`/api/files/download/${id}`)
        .set('Cookie', global.signin())
        .expect(401);

})