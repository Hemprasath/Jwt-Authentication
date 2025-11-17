import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));


app.get("/", (req, res)=> res.send("api working..."));

app.listen(port, ()=> console.log('server started on' ,port));
 


