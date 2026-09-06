import { Router } from "express";
import { userAuth } from "../middleware/adminAuth.js";
const router = Router();

router.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    const user = req.user;
    console.log("connection req sent");
    res.send(`${user.firstName} sent a connection request`);
})

export default router;