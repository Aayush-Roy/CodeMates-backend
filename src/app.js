import express from "express";
import { connectDB } from "./config/database.js";
import { userModel } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
const app = express();
app.use(express.json());


app.post("/signup",async(req,res)=>{
    // console.log(req.body);
    try{
    validateSignUpData(req);
    const newUser =  userModel(req.body)
    console.log(newUser)
   await newUser.save();
    res.send("User Created", newUser)
    }catch(err){
        res.send(err.message);
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
