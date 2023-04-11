import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const setup = async (cookie: string[]) => {

    const res = await request(app)
        .post('/api/projects/')
        .set('Cookie', cookie)
        .send({
            projectName: 'Test Project'
        })
        .expect(201)

    return res.body;
}   

it('returns all user projects', async () => {
    const cookie = global.signin();

    const project1 = await setup(cookie)
    const project2 = await setup(cookie)
    const project3 = await setup(cookie)

    const res = await request(app)
        .get('/api/projects')
        .set('Cookie', cookie)
        .expect(200)

    expect(res.body.projects.length).toEqual(3);
})

it('returns a single project', async () => {
    const cookie = global.signin();

    const project1 = await setup(cookie);

    await setup(cookie);
    await setup(cookie);

    const { body } = await request(app)
        .get(`/api/projects/${project1.id}`)
        .set('Cookie', cookie)
        .expect(200)

    expect(body.project.id).toEqual(project1.id)
})

it('returns a 400 if the project is not found', async () => {
    const cookie = global.signin();

    await setup(cookie);
    await setup(cookie);

    const { body } = await request(app)
    .get(`/api/projects/${new mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', cookie)
    .expect(400)

})