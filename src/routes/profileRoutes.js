import { Router } from "express";
import { userAuth } from "../middleware/adminAuth";
const router = Router();

router.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        if(!user) throw new Error("user not found");
    res.send(user);
    }catch(err){
        console.log(err);
        res.send("failed to fetch profile", err);
    }
    
})


export default router;