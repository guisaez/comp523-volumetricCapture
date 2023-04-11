import request from "supertest";
import { app } from "../../app";

it('returns a 400 Bad Request if invalid ProjectId', async () => {

    await request(app)
        .post('/api/model/run/dsfdsfwe')
        .set('Cookie', global.signin())
})