import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModal from "../models/usermodels";


export const register = async (req, res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({sucess: false, message: "Missing user data"});
    }

    try {
        const existing_user = await userModal.findOne({email});
        
        if(existing_user){
            return res.json({sucess:false, message:"user already exist"});
        }

        const hased_password = await bcrypt.hash(password, 10);

        const user = new userModal({name, email, password: hased_password});

        user.save();
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie('token', token,{
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxage : 7*24*60*60*100,
        })

        return ees.json({success:true});

    } catch (error) {
        res.json({success: false, message: error.message})
    }
} 


export const login = async (req, res)=> {
    const {email, password} = req.body; 

    if(!email || !password){
        return res.json({sucess:false, message:"email and password is missing"})
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

        res.cookie('token', token,{
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
            maxage : 7*24*60*60*100,
        })

        return res.json({success:true});

    } catch (error) {
       return res.json({success: false, message: error.message});
    }
}



export const logout = (req, res) => {
    try {
        res.clearCookie('token', token,{
            httpOnly: true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
        })
         return res.json({success:true});
    } catch (error) {
       return res.json({success: false, message: error.message})
    }
}