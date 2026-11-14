import { Server } from "socket.io";
import crypto from "crypto";
import { Chat } from "../models/chat.js";
import { Connection } from "../models/connectionRequest.js";

const getSecretRoomId = (userId, targetUserId) =>
  crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");

const areConnected = async (userId, targetUserId) => {
  const connection = await Connection.findOne({
    status: "accepted",
    $or: [
      { fromUserId: userId, toUserId: targetUserId },
      { fromUserId: targetUserId, toUserId: userId },
    ],
  });

  return !!connection;
};



export const initializeSocket = (server) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://codemates-ui.ar0671362.workers.dev",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
   

    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
      try {
        if (!(await areConnected(userId, targetUserId))) {
          console.log("NOT connected, join blocked");
          return;
        }
        const roomId = getSecretRoomId(userId, targetUserId);
        socket.join(roomId);
        console.log(firstName, "joined room:", roomId);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          if (!(await areConnected(userId, targetUserId))) {
            console.log("NOT connected, message blocked");
            return;
          }

          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({ participants: [userId, targetUserId], messages: [] });
          }

          chat.messages.push({ senderId: userId, text });
          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            userId,
            text,
            createdAt: new Date(),
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};