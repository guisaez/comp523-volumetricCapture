import request from 'supertest'
import { app } from '../../app';
import { File } from '../../models/file';
import mongoose from 'mongoose';
import { Project } from '../../models/project';
import { FileTypes, ProcessStatus } from '@teamg2023/common';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () => {
    const project = Project.build({
        projectName: 'Test Project',
        userId: new mongoose.Types.ObjectId().toHexString(),
        createdAt: new Date()
    });

    await project.save();

    const zip = File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        type: FileTypes.ZIP,
        userId: project.userId,
        name: 'zip_file.zip'
    })

    const extri = File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        type: FileTypes.EXTRINSIC,
        userId: project.userId,
        name: 'extri.yml'
    })

    const intri = File.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        type: FileTypes.EXTRINSIC,
        userId: project.userId,
        name: 'intri.yml'
    })

    await zip.save();

    await intri.save();

    await extri.save();

    project.set('zip_fileId', zip);
    project.set('intrinsic_fileId', intri);
    project.set('extrinsic_fileId', extri);

    await project.save();

    return { project };
}

it('throws a 400 Bad Request if invalid project id is provided', async () => {
    await request(app)
        .post('/api/projects/run/sdfdsfsf')
        .set('Cookie', global.signin())
        .expect(400)
})

it('throws a 400 Bad Request if project is not found', async () => {
    await request(app)
        .post(`/api/projects/run/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .expect(400)
})

it('successfully creates run model event', async () => {
    const { project } = await setup();

    const { body } = await request(app)
        .post(`/api/projects/run/${project.id}`)
        .set('Cookie', global.signin(project.userId))
        .expect(200)
   
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    expect(body.project.processStatus).toEqual(ProcessStatus.Running);
})

