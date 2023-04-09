import request from 'supertest';
import { app } from '../../app';
import fs from 'fs';
import mongoose from 'mongoose';

const fileData : Buffer = fs.readFileSync('./src/routes/__test__/test_files/test.yml');

const uploadFile = async ( cookie: string[] ) => {

    await request(app)
        .post(`/api/files/upload/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', cookie)
        .set('Content-Type', 'multipart/form-data')
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200)
        
}

it('returns all files associated with userId', async () => {
    const cookie = global.signin();
    
    await uploadFile(cookie);
    await uploadFile(cookie);

    const res = await request(app)
        .get('/api/files')
        .set('Cookie', cookie)
        .expect(200);

})