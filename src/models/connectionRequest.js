import mongoose from "mongoose";

const connectionSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect type`
        }
    }
},{
    timestamps:true,
})

export const Connection = mongoose.model("Connection", connectionSchema);