const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const path = require("path");
const Document = require("./Document");
const authRoutes = require("./authRoutes"); // ✅ Step 1: Import auth routes

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json()); // ✅ To parse JSON in request bodies
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", // use your frontend URL in production
  methods: ["GET", "POST"]
}));

// ✅ Step 2: Use auth routes
app.use("/api/auth", authRoutes);

// ✅ Serve React static files (for production build)
app.use(express.static(path.join(__dirname, "../client/build")));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

const defaultValue = "";

io.on("connection", socket => {
  console.log("🔌 User connected:", socket.id);

  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

// ✅ Fallback for React Router (client-side routes like /docs/:id)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ✅ Utility function for creating/finding document
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

// ✅ Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
