import jwt from "jsonwebtoken";
import { userModel } from "../models/user.js";
export const userAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token) throw new Error("Token is not valid!!")
        const decodedObj = await jwt.verify(token,"CODEMATES@321");
        const {_id} = decodedObj;
        const user = await userModel.findById(_id);
       
        if(!user) throw new Error("User not found");
         req.user = user;
        next();
        
        
    }catch(err){
        console.log("Error in userAuth Middleware", err.message);
        res.send(err.message)
    }
}