import { Router } from "express";
import { userAuth } from "../middleware/adminAuth.js";
import { Connection } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
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

        
        const toUser = await User.findById(toUserId);
        if(!toUser) return res.status(404).json({message:"User doesn't exist"});

        const existingConnectionRequest = await Connection.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).send({
                message:"Connection Request already sent",
            })
        }
        const connectionRequest = new Connection({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();
        res.json({
            // message:`${req.user.firstName} is ${status} in ${toUser.firstName}`,
            message: status === "interested"
    ? `Connection request sent to ${toUser.firstName}`
    : `Connection request ignored for ${toUser.firstName}`,
            data,
        })

    }catch(err){
       
        res.status(400).send("Error"+err.message);
    }
    
})


router.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        const {status, requestId} = req.params;
        const loggedInUser = req.user;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status Not Allowed!"
            })
        }
        const connectionRequest = await Connection.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });
        if(!connectionRequest){
            return res.status(404)
            .json({message:"Connection Request Not Found!"})
        }
    }catch(err){
        res.status(400).send("Error"+err.message);
    }
})

export default router;