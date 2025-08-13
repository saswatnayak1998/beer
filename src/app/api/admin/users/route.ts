import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [postsCleared, commentsCleared, sessions, accounts, tokens, users] = await prisma.$transaction([
    prisma.post.updateMany({ data: { authorId: null, authorName: "Anon" } }),
    prisma.comment.updateMany({ data: { authorId: null, authorName: "Anon" } }),
    prisma.session.deleteMany({}),
    prisma.account.deleteMany({}),
    prisma.verificationToken.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  return NextResponse.json({
    postsUpdated: postsCleared.count,
    commentsUpdated: commentsCleared.count,
    sessionsDeleted: sessions.count,
    accountsDeleted: accounts.count,
    tokensDeleted: tokens.count,
    usersDeleted: users.count,
  });
} 