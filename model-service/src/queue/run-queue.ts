import Queue from 'bull';
import { ModelCompletePublisher } from '../events/publishers/model-complete-publisher';
import { ModelErrorPublisher } from '../events/publishers/model-error-publisher';
import { natsWrapper } from '../nats-wrapper';
import { RunData } from '@teamg2023/common';
import { Run } from '../utils/Run';

interface Payload {
    projectId: string;
    userId: string;
    files: RunData[];
}

const model_run_queue = new Queue<Payload>('model:run', {
    redis: {
        host: process.env.REDIS_HOST,
    }
})

model_run_queue.process(async (job) => {
    
    try{
        const run = new Run(job.data.projectId, job.data.userId, job.data.files)

        const done = await run.run();

        if(done){
            const file = await run.uploadOutput();

            if(!file){
                return new ModelErrorPublisher(natsWrapper.client).publish({
                    projectId: job.data.projectId,
                    errors: ["Error Uploading File"]
                })
            }

            return new ModelCompletePublisher(natsWrapper.client).publish({
                projectId: file.projectId,
                file: {
                    name: file.name,
                    userId: file.userId,
                    type: file.type,
                    id: file.id,
                    version: file.version
                }
            })
        
        }

    } catch(err: any){
        return new ModelErrorPublisher(natsWrapper.client).publish({
            projectId: job.data.projectId,
            errors: [err?.message]
        })
    }

     return new ModelErrorPublisher(natsWrapper.client).publish({
        projectId: job.data.projectId,
        errors: ["Error Uploading File"]
    })
    
})

export { model_run_queue };
