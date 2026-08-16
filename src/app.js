import express from "express";
const app = express();

let user = [];

app.get("/user",(req,res)=>{
    return res.json(user);
})

app.post("/user",(req,res)=>{
    user.push({name:"Aayush",email:"a@gmail.com"});
    return res.json(user);
})

app.listen(3000,()=>{
    console.log("Server is listening on port 3000....")
})