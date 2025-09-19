// src/routes/index.js
import express from "express";

// Import semua sub-routes
import medicationRoutes from "./medicationRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import supplierRoutes from "./supplierRoutes.js";

const router = express.Router();

// Daftarkan sub-routes
router.use("/medications", medicationRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);

// Optional: endpoint pengecekan route utama
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Routes are running!",
    availableRoutes: ["/medications", "/categories", "/suppliers"],
  });
});

export default router;
