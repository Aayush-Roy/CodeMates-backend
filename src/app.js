


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
  "https://codemates-ui.ar0671362.workers.dev",
  process.env.FRONTEND_URL,
].filter(Boolean);



app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.use("/payment/webhook", express.raw({ type: "application/json" }));
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
