import { Router } from "express";
import { userAuth } from "../middleware/adminAuth.js";
import { Connection } from "../models/connectionRequest.js";
const router = Router();



router.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid Status " + status})
        }
        const connectionRequest = new Connection({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();
        res.json({
            message:"connection req sent!!",
            data,
        })

    }catch(err){
        
        res.status(400).send("Error" + err.message);
    }
    
})

export default router;