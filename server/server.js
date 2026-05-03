// app.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());

// Routes (import your routes later)
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const courseUploadRoutes = require("./routes/courseUploadRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use(cors({
  origin: [
    "http://localhost:5173",   // local React
    "https://your-frontend-url.com" // deployed frontend
  ],
  credentials: true
}));
// Route usage
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/uploadvideo", courseUploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", paymentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Level Up Server is Running");
});

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  res.status(500).json({ msg: err.message });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});