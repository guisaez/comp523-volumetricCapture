import request from 'supertest';
import { app } from '../../app';

it('throws a 401 if the user is not signed in', async () => {
    await request(app)
        .post('/api/projects')
        .send({
            projectName: 'Test Project'
        })
    .expect(401)
})

it('throws a 400 if no projectName is send or if invalid project Name', async () => {
    await request(app)
        .post('/api/projects')
        .set('Cookie', global.signin())
        .send({
            projectName: ""
        })
        .expect(400)

    await request(app)
        .post('/api/projects')
        .set('Cookie', global.signin())
        .send()
        .expect(400)

})

it('returns 201 create if project is create successfully', async () => {
    
    const { body } = await request(app)
        .post('/api/projects')
        .set('Cookie', global.signin())
        .send({
            projectName: "Test Project"
        })
        .expect(201)

    expect(body.projectName).toEqual('Test Project')
})