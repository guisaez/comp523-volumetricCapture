import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { GridFS } from '../utils/GridFS';

jest.mock('../nats-wrapper.ts');

let mongo: any;
let bucket: any;

beforeAll(async () => {

    mongo = await MongoMemoryServer.create();

    const mongoUri = mongo.getUri();

    const conn = await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {

    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany();
    }

})

afterAll(async () => {
    if(bucket){
        await bucket.drop();
    }
    await mongoose.connection.dropDatabase();
    if(mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
})