import express from "express";
import { connectDB } from "./config/database.js";
import { userModel } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import validator from "validator"
import jwt, { decode } from "jsonwebtoken";
import { userAuth } from "./middleware/adminAuth.js";
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
