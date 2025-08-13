"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

const REACTIONS = [
  { type: "LIKE", label: "👍" },
  { type: "LOVE", label: "❤️" },
  { type: "LAUGH", label: "😂" },
  { type: "WOW", label: "🤯" },
] as const;

export default function ReactionButtons({ postId }: { postId: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function react(type: string) {
    const res = await fetch(`/api/posts/${postId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) return; // silently no-op on failure
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {REACTIONS.map((r) => (
        <button key={r.type} onClick={() => startTransition(() => react(r.type))} className="border-4 border-black rounded-full px-3 py-1 bg-white hover:bg-sky-100" disabled={isPending}>
          <span className="text-xl">{r.label}</span>
        </button>
      ))}
    </div>
  );
} 