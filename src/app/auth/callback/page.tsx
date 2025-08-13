"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";

export default function AuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const run = async () => {
      const supabase = getBrowserSupabase();
      await supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {});
      router.replace("/");
    };
    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100 text-gray-900">
      <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
        Signing you in...
      </div>
    </div>
  );
} 