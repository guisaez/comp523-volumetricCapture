import request from 'supertest';
import { app } from '../../app';

it('returns a 400 if invalid credentials are provided', async () => {
    await request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test.com',
            password: 'password123'
        })
        .expect(400)

    return request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: '123'
        })
        .expect(400)
})

it('returns a 400 if user is not found', async () => {
    return  request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(400)
})


it('returns a 200 if user is successfully authenticated', async () => {
    
    await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(201);

    const res = await request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(200)

    expect(res.get('Set-Cookie')).toBeDefined()
})