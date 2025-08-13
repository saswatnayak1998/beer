import { Resend } from "resend";
import nodemailer from "nodemailer";

const resendApiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.MAIL_FROM || "no-reply@example.com";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

export async function sendOtpEmail(to: string, code: string) {
  const subject = "Your sign-in code";
  const text = `Your code is ${code}. It expires in 10 minutes.`;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({ from: fromAddress, to, subject, text });
    return;
  }

  if (!resendApiKey) throw new Error("Missing RESEND_API_KEY (and SMTP not configured)");
  const resend = new Resend(resendApiKey);
  await resend.emails.send({ from: fromAddress, to, subject, text });
} 