import request from 'supertest';
import { app } from '../../app';

it('response with details about current user', async () => {
    const cookie = await global.signin();

    const res = await request(app)
        .get('/api/auth/user')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(res.body.currentUser.email).toEqual('test@test.com')
})

it('responds with null if not authenticated', async () => {
    return request(app)
        .get('/api/auth/user')
        .send()
        .expect(200)
})