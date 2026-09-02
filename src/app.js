import express from "express";
import { connectDB } from "./config/database.js";
import { userModel } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import validator from "validator"
import jwt, { decode } from "jsonwebtoken";
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup",async(req,res)=>{
    // console.log(req.body);
    try{
    validateSignUpData(req);
    const {firstName, lastname, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword)
    const newUser =  userModel({
        firstName, lastname, email, password:hashedPassword
    });
    console.log(newUser)
   await newUser.save();
    res.send("User Created", newUser)
    }catch(err){
        res.send(err.message);
    }
  
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !validator.isEmail(email)) {
            throw new Error("Email is not valid!");
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        
       
        if (isPasswordValid) {
        const token = jwt.sign({_id:user._id},"CODEMATES@321");
        res.cookie("token",token);
        res.send("Login Successful!!");
        }else{
            throw new Error("Invalid Credentials");
        }
       

    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.get("/profile",async(req,res)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token) throw new Error("Invalid token");
        const decodedvalue = await jwt.verify(token,"CODEMATES@321");
        const {_id} = decodedvalue;
        const user = await userModel.findById(_id);
        if(!user) throw new Error("user not found");
    res.send(user);
    }catch(err){
        console.log(err);
        res.send("failed to fetch profile", err);
    }
    
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

// app.patch("/user",async(req,res)=>{
//     try{
//              const userId = req.body.userId;
//     const data = req.body;
//         const Allowed_Updated = ["userId","age","about","photoUrl","gender","skills"]
//         const isUpdateAllowed = Object.keys(data).every((k)=>Allowed_Updated.includes(k));
//         if(!isUpdateAllowed){
//             throw new Error("Update not Allowed")
//         }
    
//     console.log("data", data)
//     const user = await userModel.findByIdAndUpdate({_id:userId},data,{
//         runValidators:true,
//     });
//     // console.log(user);
//     res.send("user updated",user)
//     }catch(err){
//         res.status(500).send(err.message)
//     }
   
// })
app.patch("/user/:userId", async (req, res) => {
    try {
        const userId = req.params?.userId;
        const data  = req.body;

        const allowedUpdated = [
            "age",
            "about",
            "photoUrl",
            "gender",
            "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((key) =>
            allowedUpdated.includes(key)
        );

        if (!isUpdateAllowed) {
            return res.status(400).send("Update not allowed");
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(user);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

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
