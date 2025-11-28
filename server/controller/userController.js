import userModal from "../models/usermodels.js";

export const userData = async (req, res) =>{

    const user = await userModal.findById(req.userId);
    try {
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        else{
            return res.json({
                success: true,
                userData:{
                    name : user.name,
                    isAccountVerified : user.isAccountVerified
                }
            })
        }
        
    } catch (error) {
        return res.json({success: false, message : error.message});
    }
}