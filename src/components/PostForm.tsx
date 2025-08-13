"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartoonCard } from "@/components/ui/CartoonCard";
import { getBrowserSupabase } from "@/lib/supabase/browser";

export default function PostForm() {
  const router = useRouter();
  const supabase = getBrowserSupabase();
  const [isAuthed, setIsAuthed] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data.user));
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isAuthed) return router.push("/signin");
    if (!title || !content) return;
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, imageUrl: imageUrl || undefined, authorName }),
      });
      if (!res.ok) throw new Error("Failed to create post");
      setTitle("");
      setContent("");
      setImageUrl("");
      setAuthorName("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <CartoonCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {!isAuthed && (
          <div className="text-sm">
            You must be signed in to post. <a href="/signin" className="underline">Sign in</a>.
          </div>
        )}
        <input className="rounded-xl border-4 border-black p-2 focus:outline-none" placeholder="Catchy title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!isAuthed} />
        <textarea className="rounded-xl border-4 border-black p-2 focus:outline-none min-h-24" placeholder="Say something fun..." value={content} onChange={(e) => setContent(e.target.value)} disabled={!isAuthed} />
        <input className="rounded-xl border-4 border-black p-2 focus:outline-none" placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={!isAuthed} />
        <input className="rounded-xl border-4 border-black p-2 focus:outline-none" placeholder="Your name (optional)" value={authorName} onChange={(e) => setAuthorName(e.target.value)} disabled={!isAuthed} />
        <button type="submit" className="bg-pink-400 hover:bg-pink-500 text-black border-4 border-black rounded-xl px-4 py-2 disabled:opacity-60" disabled={loading || !isAuthed}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </CartoonCard>
  );
} 