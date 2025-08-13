export const dynamic = "force-dynamic";
export const revalidate = 0;

import PostForm from "@/components/PostForm";
import PostItem from "@/components/PostItem";
import { getServerSupabase } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = getServerSupabase();
  const { data: posts } = await supabase
    .from("posts")
    .select("id")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100 text-gray-900">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-black drop-shadow-[4px_4px_0_#fff]">
          ragebait
        </h1>
        <PostForm />
        <div className="flex flex-col gap-6">
          {(posts ?? []).map((p) => (
            <PostItem key={p.id} postId={p.id} />
          ))}
          {!posts?.length && <div className="text-center opacity-70">No posts yet. Be the first!</div>}
        </div>
      </div>
    </div>
  );
}
