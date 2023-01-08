import * as  mongoose from "mongoose";
// const {MONGO_URI} = process.env;

export const connect = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://localhost:27017/test-db').then(()=> {
        console.log("Successfully connected to  Database!!!");
    }).catch(err => {
        console.log("Database connection failed .... Exiting now");
        console.log(err);
    })
}