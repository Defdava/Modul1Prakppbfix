import express from "express";
import medicationRoutes from "./medicationRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import supplierRoutes from "./supplierRoutes.js";

const router = express.Router();

router.use("/medications", medicationRoutes);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);

export default router;
