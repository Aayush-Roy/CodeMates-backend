import express from "express";
import { connectDB } from "./config/database.js";
import { userModel } from "./models/user.js";
const app = express();
app.use(express.json());


app.post("/signup",async(req,res)=>{
    // console.log(req.body);
    const newUser = await userModel(req.body)
    newUser.save();
    res.send("User Created", newUser)
})

app.get("/user",async(req,res)=>{
    try{
    const fname = req.body.firstName;
    const user = await userModel.find({firstName:fname});
    res.status(200).json(user);

    }catch(err){
        console.log("Something went wrong!")
    }
    
})

app.get("/feed",async(req,res)=>{
    try{
    // const fname = req.body.firstName;
    const user = await userModel.find({});
    res.status(200).json(user);

    }catch(err){
        console.log("Something went wrong!")
    }
    
})

app.delete("/user", async(req,res)=>{
    const userId = req.body.userId;
    const deluser = await userModel.findByIdAndDelete(userId);
    console.log(deluser)
    res.send("user deleted");
})

connectDB().then(()=>{
    console.log("DB connection established");
    app.listen(3000,()=>{    
    console.log("Server is listening on port 3000....")
})
}).catch(err=>{
    console.log("DB connection failed", err);
})
