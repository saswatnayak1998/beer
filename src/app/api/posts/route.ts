import { NextResponse } from "next/server";
import { getRouteSupabase } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function GET() {
  const supabase = getRouteSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*, comments(*), reactions(*)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = getRouteSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, content, imageUrl } = body ?? {};
  if (!title || !content) return NextResponse.json({ error: "Missing title or content" }, { status: 400 });

  // Use service role to bypass RLS but still attribute to the signed-in user
  const admin = getServiceSupabase();
  const { data, error } = await admin
    .from("posts")
    .insert({
      title,
      content,
      image_url: imageUrl || null,
      author_id: user.id,
      author_name: user.user_metadata?.name || user.email || "Anon",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
} 