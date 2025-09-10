// src/routes/medicationRoutes.js
import express from "express";
import { getMedications, createMedication } from "../controllers/medicationController.js";

const router = express.Router();

router.get("/", getMedications);
router.post("/", createMedication);

export default router;