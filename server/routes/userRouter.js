import express from "express";
import userAuth from "../middelware/userAuth.js";
import { userData } from "../controller/userController.js";

export const userRoute = express.Router();

userRoute.get("/data" , userAuth, userData);
