// src/config/supabaseClient.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL dan SUPABASE_KEY harus didefinisikan di file .env");
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;