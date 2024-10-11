import { createClient } from "@supabase/supabase-js";
import env from "./env";
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey)
  throw new Error("Supabase URL and Key are required");

export const supabase = createClient(supabaseUrl, supabaseKey);
