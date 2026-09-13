import { Router } from "express";
import { userAuth } from "../middleware/adminAuth.js";
import { Connection } from "../models/connectionRequest.js";
const router = Router();


router.get("/user/requests/recieved", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await Connection.find({
            toUserId:loggedInUser._id,
            status:"interested"  
        }).populate("fromUserId","firstName lastName age photoUrl gender skills about");
        return res.json({
            message:"Data fetch Successfully",
            data:connectionRequests
        })
    }catch(err){
        res.status(400).send({message:"Error " + err.message})
    }
})

export default router;