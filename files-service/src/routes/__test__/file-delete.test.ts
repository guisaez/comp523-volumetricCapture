import request from "supertest";
import { app } from "../../app";
import fs from 'fs';
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

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

it('returns a 400 if the file does not exist', async () => {
    const cookie = global.signin();

    await request(app)
        .delete(`/api/files/delete`)
        .set('Cookie', cookie)
        .send({
            projectId: new mongoose.Types.ObjectId().toHexString(),
            id: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(400);

})

it('returns a 401 if the user tries to delete another user file', async () => {
    const cookie = global.signin();

    const file = await uploadFile(cookie);

    await request(app)
        .delete(`/api/files/delete`)
        .set('Cookie', global.signin())
        .send({
            projectId: new mongoose.Types.ObjectId().toHexString(),
            id: file.id
        })
        .expect(401);

})

it('returns a 204 if the file was successfully deleted', async () => {

    const cookie = global.signin();

    const file = await uploadFile(cookie);
    
    await request(app)
        .delete(`/api/files/delete`)
        .set('Cookie', cookie)
        .send({
            id: file.id,
            projectId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const { body } = await request(app)
        .get('/api/files/')
        .set('Cookie', cookie)
        .expect(200)

    expect(body.files).toEqual([]);
})

it('deletes all files associated with an user', async () => {
    const cookie = global.signin();

    const file1 = await uploadFile(cookie);
    await uploadFile(cookie);
    await uploadFile(cookie);

    await request(app)
        .delete(`/api/files/delete-all/${file1.userId}`)
        .set('Cookie', cookie)
        .expect(204)

    const { body } = await request(app)
        .get('/api/files/')
        .set('Cookie', cookie)
        .expect(200)

    expect(body.files).toEqual([]);

})