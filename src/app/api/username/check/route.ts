import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const { username } = await request.json();
  if (!username || typeof username !== "string") return NextResponse.json({ ok: false, error: "Missing username" }, { status: 400 });
  const trimmed = username.trim();
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) return NextResponse.json({ ok: false, error: "Invalid format" }, { status: 400 });

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from("profiles").select("id").eq("username", trimmed).maybeSingle();
  if (error && error.code !== "PGRST116") return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, available: !data });
} 