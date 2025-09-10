// src/models/SupplierModel.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Inisialisasi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const SupplierModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*");

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(supplier) {
    const { data, error } = await supabase
      .from("suppliers")
      .insert([supplier])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, supplier) {
    const { data, error } = await supabase
      .from("suppliers")
      .update(supplier)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from("suppliers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { message: "Deleted successfully" };
  },
};
