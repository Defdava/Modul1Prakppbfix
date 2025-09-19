import express from "express";
import { MedicationModel } from "../models/medicationModel.js";

const router = express.Router();

// ===============================
// GET all + search + pagination
// ===============================
router.get("/", async (req, res) => {
  try {
    const { search, name, description, category_id, supplier_id, page, limit } = req.query;

    const result = await MedicationModel.find({
      search,
      name,
      description,
      category_id,
      supplier_id,
      page,
      limit,
    });

    res.json({
      success: true,
      message: "Data obat berhasil diambil",
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      data: result.data,
    });
  } catch (err) {
    console.error("Error GET /medications:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data obat",
      error: err.message,
    });
  }
});

// ===============================
// POST create medication
// ===============================
router.post("/", async (req, res) => {
  try {
    const { sku, name, description, category_id, supplier_id, price, quantity } = req.body;

    if (!name || !category_id || !supplier_id) {
      return res.status(400).json({
        success: false,
        message: "Nama, category_id, dan supplier_id wajib diisi",
      });
    }

    if (price < 0) {
      return res.status(400).json({ success: false, message: "Harga tidak boleh kurang dari 0" });
    }
    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity tidak boleh kurang dari 0" });
    }

    const medication = await MedicationModel.create({
      sku,
      name,
      description,
      category_id,
      supplier_id,
      price,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Data obat berhasil ditambahkan",
      data: medication,
    });
  } catch (err) {
    console.error("Error POST /medications:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan data obat",
      error: err.message,
    });
  }
});

// ===============================
// PUT update medication
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, name, description, category_id, supplier_id, price, quantity } = req.body;

    if (price < 0) {
      return res.status(400).json({ success: false, message: "Harga tidak boleh kurang dari 0" });
    }
    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity tidak boleh kurang dari 0" });
    }

    const medication = await MedicationModel.update(id, {
      sku,
      name,
      description,
      category_id,
      supplier_id,
      price,
      quantity,
    });

    res.json({
      success: true,
      message: "Data obat berhasil diperbarui",
      data: medication,
    });
  } catch (err) {
    console.error("Error PUT /medications/:id:", err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui data obat",
      error: err.message,
    });
  }
});

// ===============================
// DELETE medication
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await MedicationModel.remove(id);

    res.json({
      success: true,
      message: "Data obat berhasil dihapus",
    });
  } catch (err) {
    console.error("Error DELETE /medications/:id:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus data obat",
      error: err.message,
    });
  }
});

// ===============================
// GET total report
// ===============================
router.get("/reports/total", async (req, res) => {
  try {
    const total = await MedicationModel.total();

    res.json({
      success: true,
      message: "Total obat berhasil dihitung",
      total,
    });
  } catch (err) {
    console.error("Error GET /medications/reports/total:", err);
    res.status(500).json({
      success: false,
      message: "Gagal menghitung total obat",
      error: err.message,
    });
  }
});

export default router;
