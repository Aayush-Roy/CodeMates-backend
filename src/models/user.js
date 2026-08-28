import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"This is default about of the user!"
    },
    skills:{
        type:[String]
    }
})

export const userModel = mongoose.model("User",userSchema);
