import express from "express";
const app = express();

app.use("/user",(req,res, next)=>{
    console.log("Response!");
    // res.send("req 1");
    next();
},(req,res)=>{
    console.log("response 2");
    res.send("req 2")
});

app.listen(3000,()=>{
    console.log("Server is listening on port 3000....")
})