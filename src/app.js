import express from "express";
import { connectDB } from "./config/database.js";
import { userModel } from "./models/user.js";
const app = express();



app.post("/signup",async(req,res)=>{
    const newUser = await userModel({
        firstName:"Aayush",
        lastName:"Roy",
        age:21,
        email:"aayush@gmail.com",
        password:"12345",
    })
    newUser.save();
    res.send("User Created", newUser)
})

connectDB().then(()=>{
    console.log("DB connection established");
    app.listen(3000,()=>{    
    console.log("Server is listening on port 3000....")
})
}).catch(err=>{
    console.log("DB connection failed", err);
})
