import mongoose from "mongoose";
import { app } from "./app";
import { DatabaseConnectionError } from "@teamg2023/common";

const start = async () => {
    console.log('Authentication Service is Starting...');

    // Check for JWT_KEY environment variable.
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined.');
    }

    // Check for MONGO_URI environment variable 
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined.');
    }

    try{
        // Establish a connection to the mongoose database using the provided MONGO_URI
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    }
    catch (err){
        throw new DatabaseConnectionError();
    }

    // Initialize the server listening on PORT 3000
    app.listen(3000, () => {
        console.log('Auth-Service Server Listening on Port 3000')
    })
}

start();