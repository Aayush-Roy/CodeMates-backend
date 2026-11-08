import mongoose, { Schema } from "mongoose";

const messageSchema = mongoose.Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    }

},{timestamps:true})

const chatSchema = mongoose.Schema({
    participants:[
        {type:Schema.Types.ObjectId, ref:"User", required:true}
    ],
    messages:[messageSchema]
})

export const Chat = mongoose.model("Chat", chatSchema);