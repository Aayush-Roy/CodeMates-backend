import mongoose from "mongoose";
import validator from "validator"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address", value)               
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid!")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
    },
    about:{
        type:String,
        default:"This is default about of the user!"
    },
    skills:{
        type:[String]
    },
   
},
 {
        timestamps:true
    }
)

userSchema.methods.getJWT = async function(){
   const user = this;
   const token = await jwt.sign({_id:user._id},"CODEMATES@321", {expiresIn:"1d"} );
   return token;
}

userSchema.methods.validatePassword = async function(PasswordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(PasswordInputByUser, passwordHash);
    return isPasswordValid;
}
//  const isPasswordValid = await bcrypt.compare(
//                 password,
//                 user.password
//     );
export const userModel = mongoose.model("User",userSchema);
