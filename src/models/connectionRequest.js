import mongoose from "mongoose";

const connectionSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect type`
        }
    }
},{
    timestamps:true
})