// import { Router } from "express";
// const router = Router();
// import validator from "validator";
// import { User } from "../models/user.js";
// import bcrypt from "bcrypt";
// import { validateSignUpData } from "../utils/validation.js";
// router.post("/signup",async(req,res)=>{
//       try{
//         validateSignUpData(req);
//         const {firstName, lastName, email, password, skills} = req.body;
//         const hashedPassword = await bcrypt.hash(password,10);
//         console.log(hashedPassword)
//         const newUser =  User({
//             firstName, lastName, email, password:hashedPassword
//         });
//         console.log(newUser)
//        const savedUser = await newUser.save();
//          const token = await savedUser.getJWT();
           
           
//             res.cookie("token", token, {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax",
//   expires: new Date(Date.now() + 8 * 3600000)
// });
//         res.json({message:"User Created", data: savedUser})
//         }catch(err){
//             res.send(err.message);
//         }
// })


// router.post("/login", async (req,res)=>{
//       try {
//             const { email, password } = req.body;
    
//             if (!email || !validator.isEmail(email)) {
//                 throw new Error("Email is not valid!");
//             }
    
//             const user = await User.findOne({ email });
    
//             if (!user) {
//                 throw new Error("Invalid Credentials");
//             }
    
//             const isPasswordValid = await user.validatePassword(password);
           
//             if (isPasswordValid) {
//             const token = await user.getJWT();
//             console.log("login token", token)
           
//             res.cookie("token", token, {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax",
//   expires: new Date(Date.now() + 8 * 3600000)
// });
//             res.send(user);
//             }else{
//                 // throw new Error("Invalid Credentials");
//                  return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//             }
           
    
//         } catch (err) {
//             res.status(400).send(err);
//         }
// })


// router.post("/logout", (req,res)=>{
//     res.cookie("token", null, {
//         expires:new Date(Date.now())
//     }).send("Logout Successfull!!!");
    
// })

// export default router;


import { Router } from "express";
import validator from "validator";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validation.js";

const router = Router();

// Common cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

const COOKIE_MAX_AGE = 8 * 60 * 60 * 1000;

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password, skills } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      skills,
    });

    const savedUser = await newUser.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    res.status(201).json({
      message: "User Created",
      data: savedUser,
    });

  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is not valid!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });

  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export default router;
