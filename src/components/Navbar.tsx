"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const supabase = getBrowserSupabase();
	const router = useRouter();
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(async ({ data }) => {
			const user = data.user;
			setEmail(user?.email ?? null);
			if (user) {
				const res = await fetch("/api/me");
				const me = await res.json();
				if (me?.user && !me?.hasUsername) router.replace("/onboarding");
			}
		});
	}, [supabase, router]);

	return (
		<nav className="w-full border-b-4 border-black bg-white/80 backdrop-blur sticky top-0 z-50">
			<div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
				<Link href="/" className="text-2xl font-black">ragebait</Link>
				<div className="flex items-center gap-3">
					{email ? (
						<>
							<span className="text-sm">{email}</span>
							<button onClick={() => supabase.auth.signOut()} className="border-4 border-black rounded-xl px-3 py-1 bg-yellow-200 hover:bg-yellow-300">Sign out</button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/signup" className="border-4 border-black rounded-xl px-3 py-1 bg-green-300 hover:bg-green-400">Sign up</Link>
							<Link href="/signin" className="border-4 border-black rounded-xl px-3 py-1 bg-pink-300 hover:bg-pink-400">Sign in</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
} 