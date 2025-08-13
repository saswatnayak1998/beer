"use client";

import { useState, Suspense } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const supabase = getBrowserSupabase();

  async function onSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatusMsg("");
    const trimmedUser = username.trim();
    if (!email) {
      setError("Enter your email");
      return;
    }
    if (!trimmedUser) {
      setError("Pick a username");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmedUser)) {
      setError("Username must be 3-20 chars, letters/numbers/_ only");
      return;
    }

    const res = await fetch("/api/username/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: trimmedUser }) });
    if (!res.ok) {
      setError("Could not check username. Try again.");
      return;
    }
    const { available } = await res.json();
    if (!available) {
      setError("Username already taken");
      return;
    }

    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setSending(false);
    if (!error) {
      try { localStorage.setItem("pending_username", trimmedUser); } catch {}
      setStatusMsg("We sent you a code. Check your email then go to Sign in.");
    } else {
      setError("Could not send code");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100 text-gray-900">
      <form onSubmit={onSendCode} className="w-full max-w-sm rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
        <h1 className="text-2xl font-black mb-4">Sign up</h1>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        {statusMsg && <div className="mb-2 text-sm">{statusMsg}</div>}
        <input className="w-full mb-3 rounded-xl border-4 border-black p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full mb-4 rounded-xl border-4 border-black p-2" placeholder="Username (unique)" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button type="submit" disabled={sending} className="w-full bg-green-300 hover:bg-green-400 text-black border-4 border-black rounded-xl px-4 py-2 disabled:opacity-60">
          {sending ? "Sending..." : "Send sign-up code"}
        </button>
        <div className="text-sm mt-3">Already have a code? <a href="/signin" className="underline">Sign in</a>.</div>
      </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
} 