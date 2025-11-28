import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import dotenv from 'dotenv'
import  {authRoute}  from "./routes/authRoutes.js";
import { userRoute } from "./routes/userRouter.js";
dotenv.config()

const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));


app.get("/", (req, res)=> res.send("api working..."));
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(port, ()=> console.log('server started on' ,port));
 


