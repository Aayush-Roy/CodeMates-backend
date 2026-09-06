import express from "express";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import validator from "validator"
import jwt, { decode } from "jsonwebtoken";
import { userAuth } from "./middleware/adminAuth.js";
import authRoute from "./routes/authRoutes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoute);


app.get("/profile",userAuth,async(req,res)=>{
    try{
      
        const user = req.user;
        if(!user) throw new Error("user not found");
    res.send(user);
    }catch(err){
        console.log(err);
        res.send("failed to fetch profile", err);
    }
    
})


app.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    const user = req.user;
    console.log("connection req sent");
    res.send(`${user.firstName} sent a connection request`);
})

connectDB().then(()=>{
    console.log("DB connection established");
    app.listen(3000,()=>{    
    console.log("Server is listening on port 3000....")
})
}).catch(err=>{
    console.log("DB connection failed", err);
})
