//     import express from "express";
//     import { connectDB } from "./config/database.js";
//     import cookieParser from "cookie-parser";
//     import { userAuth } from "./middleware/adminAuth.js";
//     import authRoute from "./routes/authRoutes.js";
//     import profileRoute from "./routes/profileRoutes.js";
//     import requestRouter from "./routes/requestRouter.js";
//     import userRouter from "./routes/userRoutes.js";
//     import paymnetRouter from "./routes/paymentRoutes.js"
//     import chatRouter from "./routes/chatRoutes.js";
//     import { Server } from "socket.io";
//     import http from "http"
//     import cors from "cors"
// import { initializeSocket } from "./utils/socket.js";
//     const app = express();
//     app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     }));
//     app.use(express.json());
//     app.use(cookieParser());


//     app.use("/", authRoute);
//     app.use("/", profileRoute);
//     app.use("/", requestRouter);
//     app.use("/",userRouter)
//     app.use("/",paymnetRouter);
//     app.use("/",chatRouter);

//    const server = http.createServer(app);

//   initializeSocket(server)

//     connectDB().then(()=>{
//         console.log("DB connection established");
//         server.listen(3000,()=>{    
//         console.log("Server is listening on port 3000....")
//     })
//     }).catch(err=>{
//         console.log("DB connection failed", err);
//     })



import express from "express";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoutes.js";
import profileRoute from "./routes/profileRoutes.js";
import requestRouter from "./routes/requestRouter.js";
import userRouter from "./routes/userRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import http from "http";
import cors from "cors";
import { initializeSocket } from "./utils/socket.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("DB connection established");

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
