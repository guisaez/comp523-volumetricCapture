import fs from 'fs';
import { File } from '../../../models/file';
import mongoose from 'mongoose';
import { ProjectDeletedEvent } from '@teamg2023/common';
import { Message } from 'node-nats-streaming';
import { ProjectDeletedListener } from '../project-deleted-listener';
import { natsWrapper } from '../../../nats-wrapper';
import request from 'supertest';
import { app } from '../../../app';

const fileData : Buffer = fs.readFileSync('./src/routes/__test__/test_files/test.yml');

const setup = async () => {

    const listener = new ProjectDeletedListener(natsWrapper.client)

    const projectId = new mongoose.Types.ObjectId().toHexString();

    const cookie = global.signin();

    const fileResponse1 = await request(app)
        .post(`/api/files/upload/${projectId}`)
        .set('Cookie', cookie)
        .set('Content-Type', 'multipart/form-data')
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    const userId = fileResponse1.body.file.userId;

    await request(app)
        .post(`/api/files/upload/${projectId}`)
        .set('Cookie', cookie)
        .set('Content-Type', 'multipart/form-data')
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test1.yml'})
        .expect(200);

    await request(app)
        .post(`/api/files/upload/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', cookie)
        .set('Content-Type', 'multipart/form-data')
        .field({
            type: "intrinsic"
        })
        .attach('file', fileData, { filename: 'test.yml'})
        .expect(200);

    const data: ProjectDeletedEvent['data'] = {
        projectId: projectId,
        userId: userId,
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { msg, data, listener, userId, projectId } 
}

it('deletes all files associated with project', async () => {
    const { msg, data, listener, userId, projectId } = await setup();

    await listener.onMessage(data, msg);

    const files = await File.find({
        projectId: projectId,
    })
    
    expect(files).toEqual([]);

    const otherFiles = await File.find({
        userId: userId
    });

    expect(otherFiles.length).toEqual(1);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

})