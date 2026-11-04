import { Server } from "socket.io";
export const initializeSocket=(server)=>{
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
      }
    });
    
    io.on("connection",(socket)=>{
      socket.on("joinChat",({firstName, userId,targetUserId})=>{
        const roomId = [userId, targetUserId].join("_")
        console.log(firstName+ "Joining room", roomId);
        socket.join(roomId)
      });

      socket.on("sendMessage",()=>{

      });

      socket.on("disconnect",()=>{

      })


    })
}