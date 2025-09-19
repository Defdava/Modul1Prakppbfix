import supabase from "../config/supabaseClient.js";

export const MedicationModel = {
  // 🔎 Cari + Pagination
  async find(filters = {}) {
    try {
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 5; // default 5 item per halaman
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("medications")
        .select(
          `
          id, sku, name, description, price, quantity,
          category_id, categories(name),
          supplier_id, suppliers(name)
        `,
          { count: "exact" } // supaya bisa dapet total count
        )
        .order("name", { ascending: true })
        .range(from, to);

      // search global (name / description)
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // filter spesifik
      if (filters.name) query = query.ilike("name", `%${filters.name}%`);
      if (filters.description) query = query.ilike("description", `%${filters.description}%`);
      if (filters.category_id) query = query.eq("category_id", filters.category_id);
      if (filters.supplier_id) query = query.eq("supplier_id", filters.supplier_id);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        data: data.map((med) => ({
          id: med.id,
          sku: med.sku,
          name: med.name,
          description: med.description,
          price: med.price,
          quantity: med.quantity,
          category: {
            id: med.category_id,
            name: med.categories?.name || null,
          },
          supplier: {
            id: med.supplier_id,
            name: med.suppliers?.name || null,
          },
        })),
      };
    } catch (err) {
      throw new Error("Gagal mengambil data obat: " + err.message);
    }
  },

  // ➕ Tambah
  async create({ sku, name, description, category_id, supplier_id, price, quantity }) {
    try {
      if (price < 0) throw new Error("Harga tidak boleh kurang dari 0");
      if (quantity < 0) throw new Error("Quantity tidak boleh kurang dari 0");

      const { data, error } = await supabase
        .from("medications")
        .insert([{ sku, name, description, category_id, supplier_id, price, quantity }])
        .select(
          `
          id, sku, name, description, price, quantity,
          category_id, categories(name),
          supplier_id, suppliers(name)
        `
        )
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
          name: data.categories?.name || null,
        },
        supplier: {
          id: data.supplier_id,
          name: data.suppliers?.name || null,
        },
      };
    } catch (err) {
      throw new Error("Gagal membuat obat: " + err.message);
    }
  },

  // ✏️ Update
  async update(id, { sku, name, description, category_id, supplier_id, price, quantity }) {
    try {
      if (price < 0) throw new Error("Harga tidak boleh kurang dari 0");
      if (quantity < 0) throw new Error("Quantity tidak boleh kurang dari 0");

      const { data, error } = await supabase
        .from("medications")
        .update({ sku, name, description, category_id, supplier_id, price, quantity })
        .eq("id", id)
        .select(
          `
          id, sku, name, description, price, quantity,
          category_id, categories(name),
          supplier_id, suppliers(name)
        `
        )
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
          name: data.categories?.name || null,
        },
        supplier: {
          id: data.supplier_id,
          name: data.suppliers?.name || null,
        },
      };
    } catch (err) {
      throw new Error("Gagal mengupdate obat: " + err.message);
    }
  },

  // 🗑️ Hapus
  async remove(id) {
    try {
      const { error } = await supabase.from("medications").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      throw new Error("Gagal menghapus obat: " + err.message);
    }
  },

  // 📊 Hitung total obat
  async total() {
    try {
      const { count, error } = await supabase
        .from("medications")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count;
    } catch (err) {
      throw new Error("Gagal menghitung total obat: " + err.message);
    }
  },
};

export default MedicationModel;
