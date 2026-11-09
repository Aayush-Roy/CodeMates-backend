import express, { Router } from 'express'
import { Chat } from '../models/chat.js';
import { userAuth } from '../middleware/adminAuth.js';
const router = Router();

router.get('/chat/:targetUserId',userAuth,async(req,res)=>{
    const userId = req.user._id;
    const {targetUserId} = req.params;
    try{
        let chat = await Chat.findOne({
            participants:{$all:[userId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName"
        }) ;

        if(!chat){
            chat = new Chat({
                participants:[userId,targetUserId],
                messages:[]
            })
            await chat.save();

        }

        return res.status(200).json(chat );
    }catch(err){
        console.log(err)
    }
})


export default router;
