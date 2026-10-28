import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        paymentId:{
            type:String,
        },
        orderId:{
        type:String,
        required:true
        },

        status:{
            type:String,
            required:true
        },
        amount:{
            type:String,
            required:true
        },
        currency:{
            type:String,
            required:true
        },
        reciept:{
            type:String,
            required:true
        },
        notes:{
            firstName:{type:String},
            lastName:{type:String},
            membershipType:{type:String}
        }
    }
    
)

export const Payment = mongoose.model("Payment", paymentSchema);