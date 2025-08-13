"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";

export default function CommentForm({ postId }: { postId: number }) {
  const router = useRouter();
  const supabase = getBrowserSupabase();
  const [isAuthed, setIsAuthed] = useState(false);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data.user));
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isAuthed) return router.push("/signin");
    if (!content) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, authorName }),
      });
      if (!res.ok) throw new Error("Failed to create comment");
      setContent("");
      setAuthorName("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input className="flex-1 rounded-xl border-4 border-black p-2 focus:outline-none" placeholder="Add a comment" value={content} onChange={(e) => setContent(e.target.value)} disabled={!isAuthed} />
      <input className="w-40 rounded-xl border-4 border-black p-2 focus:outline-none" placeholder="Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} disabled={!isAuthed} />
      <button type="submit" className="bg-green-300 hover:bg-green-400 text-black border-4 border-black rounded-xl px-4" disabled={loading || !isAuthed}>
        {loading ? "..." : "Send"}
      </button>
    </form>
  );
} 