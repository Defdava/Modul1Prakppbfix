// src/index.js
import express from "express";
import dotenv from "dotenv";

// Import route satu-satu
import supplierRoutes from "./routes/supplierRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import medicationRoutes from "./routes/medicationRoutes.js";

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

// Semua routes API langsung dipakai
app.use("/api/suppliers", supplierRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/medications", medicationRoutes);

// Port hanya dipakai saat development (local)
// Di Vercel, port diatur otomatis
const port = process.env.PORT || 5000;
if (process.env.VERCEL === undefined) {
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}

// 👇 WAJIB untuk Vercel
export default app;
