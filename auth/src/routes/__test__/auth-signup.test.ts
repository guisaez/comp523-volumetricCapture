import request from 'supertest';
import { app } from '../../app';

it('returns a 400 if an invalid email is provided', async () => {
    return  request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test.com',
            password: 'password123'
        })
        .expect(400)
})

it('returns a 400 if an invalid password is provided', async () => {
    return request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: '123'
        })
        .expect(400)
})

it('returns a 201 if an user is created', async () => {
    return request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(201)
})