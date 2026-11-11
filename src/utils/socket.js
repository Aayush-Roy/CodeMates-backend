// // import { Server } from "socket.io";
// // export const initializeSocket=(server)=>{
// //     const io = new Server(server, {
// //       cors: {
// //         origin: "http://localhost:5173",
// //         credentials: true,
// //         methods: ["GET", "POST"]
// //       }
// //     });
    
// //     io.on("connection",(socket)=>{
// //       socket.on("joinChat",({firstName, userId,targetUserId})=>{
// //         const roomId = [userId, targetUserId].sort().join("_")
// //         console.log(firstName+ "Joining room", roomId);
// //         socket.join(roomId)
// //       });

// //       socket.on("sendMessage",({
// //       firstName,
// //       userId,
// //       targetUserId,
// //       text
// //     })=>{
// //         const roomId = [userId,targetUserId].sort().join("_");
// //         console.log(firstName + " "+ text)
// //         io.to(roomId).emit("messageRecieved",{firstName, newMessage});
// //       });

// //       socket.on("disconnect",()=>{

// //       })


// //     })
// // }


// import { Server } from "socket.io";
// import crypto from "crypto"
// import { Chat } from "../models/chat.js";

// const getScretRoomId = (userId, targetUserId)=>{
//   return crypto
//   .createHash("sha256")
//   .update([userId, targetUserId].sort().join("_"))
//   .digest("hex")
// }
// export const initializeSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5173",
//       credentials: true,
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
//       // const roomId = getScretRoomId(userId,targetUserId)
//       const roomId = getScretRoomId(userId, targetUserId);

//       socket.join(roomId);

//       console.log(firstName, "joined room:", roomId);
//     });

//     socket.on(
//       "sendMessage",
//       async ({ firstName, lastName, userId, targetUserId, text }) => {
//         // const roomId = [userId, targetUserId].sort().join("_");
//         const roomId = getScretRoomId(userId, targetUserId);

//         console.log("Message received:", firstName, text);

//         const newMessage = {
//           firstName,
//           lastName,
//           userId,
//           text,
//           createdAt: new Date(),
//         };

//         try{
//           let chat = await Chat.findOne({
//             participants:{$all:[userId,targetUserId]}
//           });

//             if (!chat) {
//     chat = new Chat({
//       participants: [userId, targetUserId],
//       messages: []
//     });
//   }

//           chat.messages.push({
//             senderId:userId,
//             text
//           })
          
//           await chat.save()
//           io.to(roomId).emit("messageReceived", newMessage);
//         }catch(err){
//           console.log(err)
//         }

        
//       }
//     );

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });

//   return io;
// };


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
  console.log("connection found:", connection); // debug
  return !!connection;
};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

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