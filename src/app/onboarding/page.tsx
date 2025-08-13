"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";

export default function OnboardingPage() {
  const supabase = getBrowserSupabase();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If not signed in, redirect to signin
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/signin");
    });
  }, [supabase, router]);

  async function save() {
    setError("");
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.replace("/signin");

    const { error } = await supabase.from("profiles").insert({ id: user.id, username: username.trim() });
    setLoading(false);
    if (error) {
      setError(error.message.includes("duplicate key") ? "Username already taken" : error.message);
      return;
    }
    router.replace("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100 text-gray-900">
      <div className="w-full max-w-sm rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
        <h1 className="text-2xl font-black mb-4">Pick a username</h1>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        <input className="w-full mb-3 rounded-xl border-4 border-black p-2" placeholder="@yourname" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={save} disabled={loading} className="w-full bg-green-300 hover:bg-green-400 text-black border-4 border-black rounded-xl px-4 py-2 disabled:opacity-60">
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
} 