import express from "express";
const app = express();


// app.use((req,res)=>{
//     res.send("hello from the server");
// })
app.use("/hello/2",(req,res)=>{
    res.send("hello from the /hello/2");
})
app.use("/hello",(req,res)=>{
    res.send("hello from the /hello");
})



app.use("/test",(req,res)=>{
    res.send("testing.....")
})

app.listen(3000,()=>{
    console.log("Server is listening on port 3000....")
})