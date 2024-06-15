import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/dbs.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})
connectDB()


app.listen(process.env.PORT, () => {
    console.log("SERVER IS RUNNING on 8000");
})


// .then(()=> {
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`Server is running at 8000`)
//     },
//     app.on('error', (error) => {
//         console.log("ERROR",error)
//         throw error
//     })

// )

// })
// .catch((err) => {
//     console.log("MONGO db connection failed !!!",err);
// })












/*
import express from 'express'
const app = express()


(async() => {
    try {
        await mongoose.connect(`$(process.env.MONGO_URI)/$(DB_NAME)`)
        app.on("error", (error)=>{
            console.log("ERROR",error);
            throw error
        })

        app.listen(process.env.PORT, () =>{
            console.log("APP IS ON SeRver",process.env.PORT)
        })
        
    } catch (error) {
        console.error("ERROR",error)
        throw err
    }
})()
*/