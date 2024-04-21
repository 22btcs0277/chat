const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");
// const { user } = require("../clint/src/Component/Join/Join");

const app=express();
const port= process.env.PORT || 4000;

const users=[{}];

app.use(cors());


app.get("/",(req,res)=>{
    res.send("HELL not , ITS WORKING");
})

const server=http.createServer(app);

// const io=socketIO(server);
const io = socketIO(server, {
    cors: {
      origin: "*", // Change this to your frontend URL if needed
      methods: ["GET", "POST"]
    }
  });

io.on("connection",(socket)=>{
    console.log("New Connection");
    socket.on("joined",({user})=>{
        users[socket.id] = user;
        console.log(user)
        socket.emit("welcome",{user:"Admin",message:"welcome to the chat"})
        socket.broadcast.emit("userJoined", {user:"Admin",message:`${users[socket.id]} has joined`})
             
    })
    
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })
    
    socket.on("disconnect",()=>{
        socket.broadcast.emit("leve",`${users[socket.id]}`)
        console.log(`user left`)
    })
}); 


server.listen(port,()=>{
    console.log(`Working,${port}`);
})