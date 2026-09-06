import { Router } from "express";
const router = Router();
import validator from "validator";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validation.js";
router.post("/signup",async(req,res)=>{
      try{
        validateSignUpData(req);
        const {firstName, lastname, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword)
        const newUser =  User({
            firstName, lastname, email, password:hashedPassword
        });
        console.log(newUser)
       await newUser.save();
        res.send("User Created", newUser)
        }catch(err){
            res.send(err.message);
        }
})


router.post("/login", async (req,res)=>{
      try {
            const { email, password } = req.body;
    
            if (!email || !validator.isEmail(email)) {
                throw new Error("Email is not valid!");
            }
    
            const user = await User.findOne({ email });
    
            if (!user) {
                throw new Error("Invalid Credentials");
            }
    
            const isPasswordValid = await user.validatePassword(password);
           
            if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token",token, {expires:new Date(Date.now()+8*360000)});
            res.send("Login Successful!!");
            }else{
                throw new Error("Invalid Credentials");
            }
           
    
        } catch (err) {
            res.status(400).send(err.message);
        }
})


router.post("/logout", (req,res)=>{
    res.cookie("token", null, {
        expires:new Date(Date.now());
    })
    res.send("Logout Success")
})

export default router;