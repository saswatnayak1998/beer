import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = getRouteSupabase();
  const postId = Number(params.id);
  if (Number.isNaN(postId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const { data, error } = await supabase
    .from("comments")
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
  const { content } = body ?? {};
  if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });

  const admin = getServiceSupabase();
  const { data, error } = await admin
    .from("comments")
    .insert({
      post_id: postId,
      content,
      author_id: user.id,
      author_name: user.user_metadata?.name || user.email || "Anon",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
} 