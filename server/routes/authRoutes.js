import express from "express";
import { isAuthenticated, login, logout, register, sendOtp, verifyOtp } from "../controller/authcontroller.js";
import userAuth from "../middelware/userAuth.js";

export const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/send-otp", userAuth, sendOtp);
authRoute.post("/verify-otp", userAuth, verifyOtp);
authRoute.post("/is-auth", userAuth, isAuthenticated);