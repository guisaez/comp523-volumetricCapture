import mongoose from 'mongoose';
import { GridFS } from './utils/GridFS';
import { natsWrapper } from './nats-wrapper';
import { ModelRunListener } from './events/listeners/model-run-listener';


const start = async () => {
    console.log('Model Service is Starting...');

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID must be defined.')
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL must be defined.')
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID must be defined.')
    }
    
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        await GridFS.setBucket();
        console.log('GridFS Bucket created');

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');

            process.exit();
        })

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new ModelRunListener(natsWrapper.client).listen();
        
    } catch(err){
        console.log(err);
    }

    console.log('Model Service Started');
}

start();


