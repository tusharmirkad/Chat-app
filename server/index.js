const express = require("express") ;
const cors = require("cors") ;
const mongoose = require("mongoose") ;
const socket = require("socket.io") ;

const userRoutes = require("./routes/userRoutes") ;
const messageRoutes = require("./routes/messagesRoute") ;

const app = express() ;
require("dotenv").config() ;

app.use(cors()) ;
app.use(express.json()) ;   

app.use("/api/auth" , userRoutes) ;
app.use("/api/messages", messageRoutes) ;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB is connected Successfully") ;
}).catch((err) => {
    console.log(err.message) ;
})

const server = app.listen(process.env.PORT, (req,res) => {
    console.log(`server is start on ${process.env.PORT}`) ;
})

const io = socket(server,{
    cors:{
        origin : "http://localhost:3000",
        Credential : true,
    }
}) ;

global.onlineUsers = new Map() ;

io.on("connection", (socket) => {
    global.chatSocket = socket ;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId,socket.id) ;
    }) ;

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to) ;
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message) ;
        }
    })
})