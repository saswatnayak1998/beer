import Image from "next/image";
import CommentForm from "@/components/CommentForm";
import ReactionButtons from "@/components/ReactionButtons";
import { CartoonCard } from "@/components/ui/CartoonCard";
import { getServerSupabase } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
export default async function PostItem({ postId }: { postId: number }) {
  const supabase = getServerSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select("*, comments(*), reactions(*)")
    .eq("id", postId)
    .single();
  if (!post) return null;

  const reactionCounts: Record<string, number> = {};
  for (const r of post.reactions || []) {
    reactionCounts[r.type] = (reactionCounts[r.type] ?? 0) + 1;
  }

  return (
    <CartoonCard className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black">{post.title}</h3>
          <span className="text-xs">by {post.author_name}</span>
        </div>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <div className="relative w-full h-64">
            <Image src={post.image_url} alt="post" fill className="object-cover rounded-xl border-4 border-black" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <ReactionButtons postId={post.id} />
          <div className="flex items-center gap-2 text-sm">
            <span>👍 {reactionCounts["LIKE"] ?? 0}</span>
            <span>❤️ {reactionCounts["LOVE"] ?? 0}</span>
            <span>😂 {reactionCounts["LAUGH"] ?? 0}</span>
            <span>🤯 {reactionCounts["WOW"] ?? 0}</span>
          </div>
        </div>
        <div className="mt-2">
          <h4 className="font-black">Comments</h4>
          <div className="flex flex-col gap-2 mt-2">
            {(post.comments || []).map((c: CommentRow) => (
              <div key={c.id} className="rounded-xl border-4 border-black bg-white p-2">
                <div className="text-xs opacity-70">{c.author_name}</div>
                <div>{c.content}</div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <CommentForm postId={post.id} />
          </div>
        </div>
      </div>
    </CartoonCard>
  );
} 