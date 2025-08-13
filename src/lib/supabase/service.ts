import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const serviceUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceUrl) {
  throw new Error("Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL for service client");
}

export function getServiceSupabase() {
  if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for service client");
  return createClient<Database>(serviceUrl!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
} 