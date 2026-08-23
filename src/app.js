import express from "express";
import { adminAuth } from "./middleware/adminAuth.js";
const app = express();

app.use("/admin",adminAuth);
// app.use("/admin",(req,res, next)=>{
//     const token = "xyz";
//     const isAuthorized = token ==="xyz";
//     console.log("Admin auth checked")
//     if(!isAuthorized){
//         res.status(401).send("Unauthorized");
//     }else{
//         next();
//     }
// })

app.get("/admin/getData",(req,res)=>{
  res.send("All Data")
})

app.get("/admin/delData",(req,res)=>{
    res.send("Deleted user")
})

app.listen(3000,()=>{
    console.log("Server is listening on port 3000....")
})