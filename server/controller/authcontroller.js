import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModal from "../models/usermodels.js";
import transporter from "../config/nodemailer.js";


export const register = async (req, res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: "Missing user data"});
    }

    try {
        const existing_user = await userModal.findOne({email});
        
        if(existing_user){
            return res.json({success:false, message:"user already exist"});
        }

        const hased_password = await bcrypt.hash(password, 10);

        const user = new userModal({name, email, password: hased_password});

        await user.save();
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie('token', token,{
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge : 7*24*60*60*100,
        });

        const mail = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "welcome to MY WEBSITE",
            text : `Your account has been created successfully with email: ${email}`
        }

        await transporter.sendMail(mail);

        return res.json({success:true});

    } catch (error) {
        res.json({success: false, message: error.message})
    }
} 


export const login = async (req, res)=> {
    const {email, password} = req.body; 

    if(!email || !password){
        return res.json({success:false, message:"email and password is missing"})
    }
     

    try {
        const user = await userModal.findOne({email});

        if(!user){
            return res.json({success:false, message : "user not found!"});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false, message: "Invalid password"})
        }

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie('token',{
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxage : 7*24*60*60*100,
        })

        return res.json({success:true, message:"login successfull..."});

    } catch (error) {
       return res.json({success: false, message: error.message});
    }
}



export const logout = (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
        })
         return res.json({success:true, message:"logout successfully "});
    } catch (error) {
       return res.json({success: false, message: error.message})
    }
}


//verify otp

export const sendOtp = async (req, res) =>{
    try {
        const {userId} = req.body;

        const user = await userModal.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false, message : "user already verified"});
        }

        const otp = String(Math.floor(100000 + Math.random()* 900000));

        user.verifyOtp = otp;
        user.verifyOtpExperiedAt = Date.now() + 24 * 60 * 60 *1000;
        await user.save(); 

        const mail = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Account Verification Code",
            text : `verify your account with this otp,  Your otp is ${otp}`
        }

        await transporter.sendMail(mail);

        res.json({success : true, message: "otp send successfully"});
    } catch (error) {
        return res.json({success : false, message : error.message});
    }
}

export const verifyOtp = async (req, res) =>{
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success: false, message : "Not a valid otp for user"});
    }

    try {
        const user = await userModal.findOne(userId);

        if(!user){
            return res.json({success: false, message : "user not found"});
        }
        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success: false, message : "Invalid otp"});
        }
        if(user.verifyOtpExperiedAt < Date.now()){
            return res.json({success: false, message : "otp expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExperiedAt = 0;

        await user.save();

        return res.json({success : true, message : "Email verified successfully"});
    } catch (error) {
        return res.json({success: false, message : error.message});
    }
}