import userModal from "../models/usermodels";

export const userData = async (req, res) =>{
    const {userId} = req.body;
    const user = await userModal.findById(userId);
    try {
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        
    } catch (error) {
        return res.json({success: false, message : error.message});
    }
}