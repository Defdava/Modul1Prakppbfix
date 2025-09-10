// src/models/medicationModel.js
import supabase from "../config/supabaseClient.js";

export const MedicationModel = {
  async find() {
    try {
      const { data, error } = await supabase
        .from("medications")
        .select(`
          id, sku, name, description, price, quantity,
          category_id, categories(name),
          supplier_id, suppliers(name)
        `)
        .order("name", { ascending: true });

      if (error) throw error;

      return data.map((med) => ({
        id: med.id,
        sku: med.sku,
        name: med.name,
        description: med.description,
        price: med.price,
        quantity: med.quantity,
        category: {
          id: med.category_id,
          name: med.categories.name,
        },
        supplier: {
          id: med.supplier_id,
          name: med.suppliers.name,
        },
      }));
    } catch (err) {
      throw new Error("Gagal mengambil data obat: " + err.message);
    }
  },

  async create({ sku, name, description, category_id, supplier_id, price, quantity }) {
    try {
      // Validasi category_id
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("id", category_id)
        .single();

      if (categoryError || !category) {
        throw new Error(`Kategori dengan ID ${category_id} tidak ditemukan`);
      }

      // Validasi supplier_id
      const { data: supplier, error: supplierError } = await supabase
        .from("suppliers")
        .select("id")
        .eq("id", supplier_id)
        .single();

      if (supplierError || !supplier) {
        throw new Error(`Pemasok dengan ID ${supplier_id} tidak ditemukan`);
      }

      // Validasi SKU
      if (sku) {
        const { data: existingSku, error: skuError } = await supabase
          .from("medications")
          .select("sku")
          .eq("sku", sku)
          .single();

        if (existingSku) {
          throw new Error(`SKU ${sku} sudah digunakan`);
        }
        if (skuError && skuError.code !== "PGRST116") {
          throw skuError;
        }
      }

      const { data, error } = await supabase
        .from("medications")
        .insert([{ sku, name, description, category_id, supplier_id, price, quantity }])
        .select(`
          id, sku, name, description, price, quantity,
          category_id, categories(name),
          supplier_id, suppliers(name)
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        sku: data.sku,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        category: {
          id: data.category_id,
          name: data.categories.name,
        },
        supplier: {
          id: data.supplier_id,
          name: data.suppliers.name,
        },
      };
    } catch (err) {
      throw new Error("Gagal membuat obat: " + err.message);
    }
  },
};

export default MedicationModel;