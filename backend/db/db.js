import mongoose from 'mongoose'
import dotenv from "dotenv";

dotenv.config();


function connectDB(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Mongo db connected succesfully")})
        .catch(err=>{
            console.log(err)
        })
}

export default connectDB