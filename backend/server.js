import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import project from "./models/project.model.js";
import generateResult from "./services/ai.service.js";
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.headers?.authorization;
    const token =
      socket.handshake.auth?.token ||
      (authHeader ? authHeader.split(" ")[1] : null);
    const projectId = socket.handshake.query.projectId;
    if (!projectId) {
      throw new Error("No room provided");
    }

    socket.project = await project.findById(projectId);

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("a user connected");
  socket.join(socket.roomId);
  socket.on("project-message", async data => {
    // Save user's message to DB
    await project.findByIdAndUpdate(socket.roomId, {
      $push: { messages: data }
    });

    const isAiCalled = data.message.includes("@ai")
    if (isAiCalled) {
      const prompt = data.message.replace("@ai", "");
      const result = await generateResult(prompt);
      
      const aiMessage = {
        message: result,
        sender: { username: "AI" }
      };

      // Save AI's message to DB
      await project.findByIdAndUpdate(socket.roomId, {
        $push: { messages: aiMessage }
      });
    
      io.to(socket.roomId).emit("project-message", aiMessage);
      return;
    }
    
    socket.broadcast.to(socket.roomId).emit("project-message", data);
  });
  socket.on("disconnect", () => {
    console.log('user disconnected')
    socket.leave(socket.roomId)
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
