import cors from 'cors'
import express from 'express';
import morgan from 'morgan'
import connectDB from './db/db.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import projectRouter from './routes/project.route.js'
import aiRouter from './routes/ai.routes.js'
connectDB();


const app=express();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/users',userRouter)
app.use('/projects',projectRouter)
app.use('/ai',aiRouter)

app.get("/",(req,res)=>{
    res.send("hello world");
})


export default app;