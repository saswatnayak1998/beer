"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/";
  const supabase = getBrowserSupabase();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setLoading(false);
    if (!error) {
      // Attempt to claim pending username from signup
      try {
        const pending = localStorage.getItem("pending_username");
        if (pending) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("profiles").insert({ id: user.id, username: pending });
          }
          localStorage.removeItem("pending_username");
        }
      } catch {}
      router.push(callbackUrl);
    } else setStatusMsg("Invalid code or email");
  }

  async function onSendCode() {
    setStatusMsg("");
    if (!email) {
      setStatusMsg("Enter your email first");
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setSending(false);
    if (!error) setStatusMsg("Code sent. Check your email");
    else setStatusMsg("Could not send code");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100 text-gray-900">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
        <h1 className="text-2xl font-black mb-4">Sign in</h1>
        {statusMsg && <div className="mb-2 text-sm">{statusMsg}</div>}
        <div className="flex gap-2 mb-2">
          <input className="w-full rounded-xl border-4 border-black p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" onClick={onSendCode} disabled={sending} className="whitespace-nowrap border-4 border-black rounded-xl px-3 bg-yellow-200 hover:bg-yellow-300">
            {sending ? "Sending..." : "Send code"}
          </button>
        </div>
        <input className="w-full mb-4 rounded-xl border-4 border-black p-2" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} />
        <button type="submit" disabled={loading} className="w-full bg-pink-400 hover:bg-pink-500 text-black border-4 border-black rounded-xl px-4 py-2 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
} 