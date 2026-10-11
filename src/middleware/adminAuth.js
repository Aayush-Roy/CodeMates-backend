// import jwt from "jsonwebtoken";
// import { User } from "../models/user.js";
// export const userAuth = async(req,res,next)=>{
//     try{
//         const {token} = req.cookies;
//         console.log("Cookies:", req.cookies);
//         console.log("Token:", req.cookies);
//         console.log("token-->", token)
//         if(!token) throw new Error("Token is not valid!!")
//         const decodedObj =  jwt.verify(token,"CODEMATES@321");
//     console.log("Decoded", decodedObj)
//         const {_id} = decodedObj;
//         const user = await User.findById(_id);
       
//         if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }
//      req.user = user;
//         next();
        
        
//     }catch(err){
//         console.log("Error in userAuth Middleware", err.message);
//         res.send(err.message)
//     }
// }


import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please login" });
    }

    const { _id } = jwt.verify(token, "CODEMATES@321");
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in userAuth Middleware", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};