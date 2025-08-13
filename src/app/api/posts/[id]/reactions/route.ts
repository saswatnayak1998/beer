import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = getRouteSupabase();
  const postId = Number(params.id);
  if (Number.isNaN(postId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const { data, error } = await supabase
    .from("reactions")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = getRouteSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const postId = Number(params.id);
  if (Number.isNaN(postId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const body = await request.json();
  const { type } = body ?? {};
  if (!type || !["LIKE", "LOVE", "LAUGH", "WOW"].includes(type)) return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });

  const admin = getServiceSupabase();
  // Enforce one reaction per user/type by deleting any existing one, then inserting
  await admin
    .from("reactions")
    .delete()
    .eq("post_id", postId)
    .eq("reactor_id", user.id)
    .eq("type", type);

  const { data, error } = await admin
    .from("reactions")
    .insert({ post_id: postId, type, reactor_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
} 