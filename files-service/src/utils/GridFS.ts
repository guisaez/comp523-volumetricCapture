import mongoose from "mongoose";

export class GridFS {
    static bucket: mongoose.mongo.GridFSBucket;

    static async getBucket() {
        if(!this.bucket) {
            const connection = mongoose.connection;
            if(!connection.db){
                await new Promise(resolve => {
                    connection.once('open', resolve);
                })
            }

            this.bucket = new mongoose.mongo.GridFSBucket(connection.db, {
                bucketName: 'files'
            });
        }

        return this.bucket;
    }

}