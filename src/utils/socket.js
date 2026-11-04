import { Server } from "socket.io";
export const initializeSocket=(server)=>{
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
      }
    });
    
    io.on("connect",(socket)=>{
      // 
    })
}