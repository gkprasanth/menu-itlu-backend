import express from "express";
import { registerRoutes } from "./routes.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors())

// ✅ Simple request logger middleware (optional, you can remove if not needed)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`
    );
  });
  next();
});

(async () => {
  // ✅ Connect to MongoDB
  await connectDB();

  // ✅ Register Routes
  const server = await registerRoutes(app);

  // ✅ Global error handler
  app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  // ✅ Start server
  const port = parseInt(process.env.PORT || "5500", 10);
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
})();
