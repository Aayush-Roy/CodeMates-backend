// import { Server } from "socket.io";
// export const initializeSocket=(server)=>{
//     const io = new Server(server, {
//       cors: {
//         origin: "http://localhost:5173",
//         credentials: true,
//         methods: ["GET", "POST"]
//       }
//     });
    
//     io.on("connection",(socket)=>{
//       socket.on("joinChat",({firstName, userId,targetUserId})=>{
//         const roomId = [userId, targetUserId].sort().join("_")
//         console.log(firstName+ "Joining room", roomId);
//         socket.join(roomId)
//       });

//       socket.on("sendMessage",({
//       firstName,
//       userId,
//       targetUserId,
//       text
//     })=>{
//         const roomId = [userId,targetUserId].sort().join("_");
//         console.log(firstName + " "+ text)
//         io.to(roomId).emit("messageRecieved",{firstName, newMessage});
//       });

//       socket.on("disconnect",()=>{

//       })


//     })
// }


import { Server } from "socket.io";
import crypto from "crypto"

const getScretRoomId = (userId, targetUserId)=>{
  return crypto
  .createHash("sha256")
  .update([userId, targetUserId].sort().join("_"))
  .digest("hex")
}
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

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getScretRoomId(userId,targetUserId)

      socket.join(roomId);

      console.log(firstName, "joined room:", roomId);
    });

    socket.on(
      "sendMessage",
      ({ firstName, userId, targetUserId, text }) => {
        const roomId = [userId, targetUserId].sort().join("_");

        console.log("Message received:", firstName, text);

        const newMessage = {
          firstName,
          userId,
          text,
          createdAt: new Date(),
        };

        io.to(roomId).emit("messageReceived", newMessage);
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
