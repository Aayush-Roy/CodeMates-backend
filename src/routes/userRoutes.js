import { Router } from "express";
import { userAuth } from "../middleware/adminAuth";
import { Connection } from "../models/connectionRequest";
const router = Router();


router.get("/user/requests", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = Connection.find({
            
        })
    }catch(err){
        return res.status(400).send("Error" + err.message);
    }
})


export default router;