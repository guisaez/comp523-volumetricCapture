import Queue from 'bull';
import { ModelCompletePublisher } from '../events/publishers/model-complete-publisher';
import { ModelErrorPublisher } from '../events/publishers/model-error-publisher';
import { natsWrapper } from '../nats-wrapper';
import { RunData } from '@teamg2023/common';
import { Run } from '../utils/Run';
import mongoose from 'mongoose';

interface Payload {
    projectId: string;
    files: RunData[];
}

const model_run_queue = new Queue<Payload>('model:run', {
    redis: {
        host: process.env.REDIS_HOST,
    }
})

model_run_queue.process(async (job) => {
    
    try{
        const run = new Run(job.data.projectId, job.data.files)

        await run.run();

        new ModelCompletePublisher(natsWrapper.client).publish({
            projectId: job.data.projectId,
            output_fileId: new mongoose.Types.ObjectId().toHexString()
        })
        
    } catch(err: any){
        new ModelErrorPublisher(natsWrapper.client).publish({
            projectId: job.data.projectId,
            errors: [err?.message]
        })
    }
    
})

export { model_run_queue };
