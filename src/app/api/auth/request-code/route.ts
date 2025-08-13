import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/email";

function generateCode(): string {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.emailOTP.create({ data: { email, codeHash, expiresAt } });

  try {
    await sendOtpEmail(email, code);
  } catch (err) {
    console.warn("Failed to send OTP email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
} 