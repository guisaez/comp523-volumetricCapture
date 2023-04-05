import request from 'supertest';
import fs from 'fs';
import { app } from '../../app';

const fileData : Buffer = fs.readFileSync('./src/routes/__test__/test_files/test.yml');
const updatedFileData: Buffer = fs.readFileSync('./src/routes/__test__/test_files/test2.yml');
const zipData: Buffer =  fs.readFileSync('./src/routes/__test__/test_files/raw_images_zip.zip');

it('returns a 400 if file is not provided', async () => {
   const cookie = global.signin();
   
    const res = await request(app)
        .post('/api/files/upload')
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
        .field({
            type: "intrinsic"
        })
        .expect(400);
});

it('returns a 400 if type is not provided', async () => {
    const cookie = global.signin();
   
    const res = await request(app)
        .post('/api/files/upload')
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
        .expect(400);
});

it('returns a 401 Not Authorized if different user tries to update the file', async () => {
    const user1cookie = global.signin();

    const res = await request(app)
        .post('/api/files/upload')
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', user1cookie)
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);
    
    
    return request(app)
        .put(`/api/files/${res.body.file.id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', global.signin())
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(401);
    
});


it('returns 404 NotFound if file type is not the same as stored type', async () => {
    const cookie = global.signin();

    const res = await request(app)
        .post('/api/files/upload')
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
        .post('/api/files/upload')
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    
    const fileId = res.body.file.id;

    const updatedRes = await request(app)
        .put(`/api/files/${fileId}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .attach('file', updatedFileData, { filename: 'test2.yml'})
        .field({
            type: "intrinsic"
        })
        .expect(200);

    expect(updatedRes.body.file.id).toEqual(fileId);
    expect(updatedRes.body.file.userId).toEqual(res.body.file.userId);
    expect(updatedRes.body.file.type).toEqual(res.body.file.type);
});