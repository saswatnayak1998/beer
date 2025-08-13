import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

function createServerSupabase() {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            /* no-op on static renders */
          }
        },
        remove(name: string) {
          try {
            cookieStore.delete(name);
          } catch {
            /* no-op on static renders */
          }
        },
      },
    }
  );
  return supabase;
}

export function getServerSupabase() {
  return createServerSupabase();
}

export function getRouteSupabase() {
  return createServerSupabase();
} 