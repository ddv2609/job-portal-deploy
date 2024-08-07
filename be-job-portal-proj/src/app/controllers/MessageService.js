const { Server } = require("socket.io");

const Chat = require("../models/Chat.model");
const Member = require("../models/Member.model");

let messageBuffer = [];
let updating = false;
const BUFFER_LIMIT = 100;

const flushBuffer = async () => {
  console.log("Flush");
  const cache = [...messageBuffer];
  messageBuffer = [];
  if (updating)
    return;

  try {
    if (cache.length > 0) {
      updating = true;
      await Chat.insertMany(cache);
    }
  } catch (error) {
    console.log(`[MESSAGE SERVICE]: ERROR ${error} MessageService.js (func flush)`);
  } finally {
    updating = false;
  }
}

module.exports.runMessageService = (server) => {
  const io = new Server(server, {
    cors: {
      // origin: "https://ptit-job-portal.vercel.app",
      origin: ["https://ptit-job-portal.vercel.app", "https://ptit-job-portal.vercel.app:80"],
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    const time = new Date();
    console.log(`A user connected - ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
    socket.user = {};
    
    socket.on('disconnect', async () => {
      await flushBuffer();
      if (socket.user.mid)
        await Member.updateOne({ _id: socket.user.mid }, {
          online: false,
          onlineAt: Date.now(),
        });
      console.log(`User with ID ${socket.user.mid} left room`);
    });
  
    socket.on("online", async (mid) => {
      socket.user.mid = mid;
      console.log(`${mid} online!`);
      await flushBuffer();
      await Member.updateOne({ _id: mid }, {
        online: true,
        onlineAt: Date.now(),
      });
      console.log(`User with ID ${mid} joined room`);
    });

    socket.on("load", async ({ owner, friend }) => {
      try {
        console.log(`${socket.user.mid} load!`);
        socket.user.chatWithFid = friend;
        socket.join(owner + "<->" + friend);
        await flushBuffer();
        const messages = await Chat.find({
          $or: [
            { $and: [ { senderId: owner }, { receiverId: friend } ] },
            { $and: [ { senderId: friend }, { receiverId: owner } ] },
          ]
        }).select("_id senderId receiverId content sentAt");

        io.to(owner + "<->" + friend).emit("receiver", {
          load: true,
          messages: messages,
        });
      } catch (error) {
        console.log(`[MESSAGE SERVICE]: ERROR ${error} MessageService.js (on load)`);
      }
    });

    socket.on("leave", async () => {
      console.log(`${socket.user.mid} left!`);
      flushBuffer();
      socket.leave(socket.user.mid + "<->" + socket.user.chatWithFid);
    });
  
    socket.on("sender", ({senderId, receiverId, content, sentAt=Date.now() }) => {
      console.log(senderId, receiverId, content, socket.user.chatWithFid);
      try {
        const payload = {
          senderId,
          receiverId,
          content,
          sentAt,
        };
        messageBuffer.push(payload);

        if (messageBuffer.length >= BUFFER_LIMIT)
          flushBuffer();

        io.to(receiverId + "<->" + senderId).emit("receiver", [{ 
          _id: Date.now(),
          ...payload,
          load: false,
        }]);
      } catch (error) {
        console.log(`[MESSAGE SERVICE]: ERROR ${error} MessageService.js (on sender)`);
      }
    });

    if (socket.recovered) {
      console.log("Recovered!");
    } else {
      console.log("New connection!");
    }
  });
}