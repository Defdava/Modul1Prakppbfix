// src/index.js
import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // router utama

dotenv.config();

const app = express();
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running!",
  });
});

// Semua routes API
app.use("/api", routes);

// Port hanya dipakai untuk local dev
const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}

// 👇 WAJIB untuk Vercel
export default app;
