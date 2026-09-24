import express from "express";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import { userAuth } from "./middleware/adminAuth.js";
import authRoute from "./routes/authRoutes.js";
import profileRoute from "./routes/profileRoutes.js";
import requestRouter from "./routes/requestRouter.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))


app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRouter);
app.use("/",userRouter)





connectDB().then(()=>{
    console.log("DB connection established");
    app.listen(3000,()=>{    
    console.log("Server is listening on port 3000....")
})
}).catch(err=>{
    console.log("DB connection failed", err);
})
