const { Server } = require("socket.io");
const http = require("http");
const { createServer } = require("http");

const express = require("express");

const app = express();
const server = createServer(app);

// create a new socket io
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// return the socket id when we give the user id
const getRecieverSocketId = (userId) => {
    return userSocketMap[userId];
};

//used to store online users
const userSocketMap = {
    // userId = database, socketId = socket.id
};

//listen for a connection
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server, getRecieverSocketId };
