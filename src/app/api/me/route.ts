import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getRouteSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ user: null });
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  return NextResponse.json({ user: { id: user.id, email: user.email }, hasUsername: !!profile?.username });
} 