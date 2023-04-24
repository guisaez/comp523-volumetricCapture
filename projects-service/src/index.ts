import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { FileUpdatedListener } from './events/listeners/file-updated-listener';
import { FileUploadedListener } from './events/listeners/file-uploaded-listener';
import { FileDeletedListener } from './events/listeners/file-deleted-listener';
import { ModelCompleteListener } from './events/listeners/model-completed-listener';
import { ModelErrorListener } from './events/listeners/model-error-listener';

const start = async () => {
    console.log('Projects Service is Starting...');

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }

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

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');

            process.exit();
        })

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new FileUploadedListener(natsWrapper.client).listen();
        new FileUpdatedListener(natsWrapper.client).listen();
        new FileDeletedListener(natsWrapper.client).listen();
        new ModelCompleteListener(natsWrapper.client).listen();
        new ModelErrorListener(natsWrapper.client).listen();

    } catch(err){
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Projects-Service Listening on Port: 3000')
    })
    
}

start();


