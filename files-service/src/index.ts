
import { app } from './app';
import { GridFSBucket, MongoClient } from 'mongodb';

const start = async () => {
    console.log('Files Service is Starting...');

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    /*
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID must be defined.')
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL must be defined.')
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID must be defined.')
    }
    */

    try{
        await MongoClient.connect(process.env.MONGO_URI);

        console.log('Connected to MongoDB');
    } catch(err){
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Files-Service Listening on Port: 3000')
    })

}

start();


