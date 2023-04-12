import mongoose from "mongoose";

export class GridFS {
    static bucket: mongoose.mongo.GridFSBucket;

    static async setBucket() {
        if(!this.bucket){
            const connection = mongoose.connection;

            if(!connection.db){
                await new Promise(resolve => {
                    connection.once('open', resolve);
                })
            }

            this.bucket = new mongoose.mongo.GridFSBucket(connection.db, {
                bucketName: 'files',
                chunkSizeBytes: 1024 * 1024
            });
        }

        return this.bucket;
    }
    
    static async getBucket() {
        return this.bucket;
    }

}