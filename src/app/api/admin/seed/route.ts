import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/service";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const supabase = getServiceSupabase();

  const { clear } = await request.json().catch(() => ({ clear: false }));

  if (clear) {
    await supabase.from("reactions").delete().neq("id", 0);
    await supabase.from("comments").delete().neq("id", 0);
    await supabase.from("posts").delete().neq("id", 0);
  }

  const samples = [
    {
      title: "Welcome to ragebait!",
      content: "Post silly thoughts, react with emojis, and have fun.",
      author_name: "Cartoon Cat",
    },
    {
      title: "What’s your favorite snack?",
      content: "Mine’s donuts with rainbow sprinkles.",
      author_name: "Snack Goblin",
    },
    {
      title: "Show your pet!",
      content: "Describe your pet like a movie trailer.",
      author_name: "Pet Parrot",
    },
    {
      title: "Tiny wins today",
      content: "Share a small W that made you smile.",
      author_name: "Wins Wizard",
    },
    {
      title: "Weekend plans thread",
      content: "Cartoons, naps, snacks. In that order.",
      author_name: "Chill Panda",
    },
  ];

  const { data: posts, error } = await supabase
    .from("posts")
    .insert(samples.map((p) => ({ ...p, image_url: null, author_id: null })))
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Seed some reactions for variety
  const types = ["LIKE", "LOVE", "LAUGH", "WOW"] as const;
  const reactionRows = (posts || []).flatMap((p) =>
    Array.from({ length: Math.floor(Math.random() * 6) + 2 }).map(() => ({
      post_id: p.id,
      type: types[Math.floor(Math.random() * types.length)],
    }))
  );
  if (reactionRows.length) {
    await supabase.from("reactions").insert(reactionRows);
  }

  return NextResponse.json({ insertedPosts: posts?.length ?? 0, insertedReactions: reactionRows.length });
} 