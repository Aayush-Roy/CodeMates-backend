import { Router } from "express";
import { userAuth } from "../middleware/adminAuth.js";
import { validateEditprofileData } from "../utils/validation.js";
const router = Router();

router.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        if(!user) throw new Error("user not found");
    res.send(user);
    }catch(err){
        console.log(err);
        res.send("failed to fetch profile", err);
    }
    
})


router.patch("/profile/edit",userAuth, async(req,res)=>{
    try{
       if(!validateEditprofileData(req)){

           throw new Error("Invalid Edit Request");
       }
       const loggedInUser = req.user;
       Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
       await loggedInUser.save();
       res.json({
        message:`${loggedInUser.firstName} your profile was updated`,
        data:loggedInUser,
       })
    }catch(err){
        
      res.status(400).send("Error: " + err.message);
    }
})


export default router;