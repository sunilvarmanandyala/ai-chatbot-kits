// src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  // Now TS knows session.user is defined and has an `id`
  const userId = session.user.id;

  const client = await clientPromise;
  const doc = await client.db().collection("settings").findOne({ userId });

  return NextResponse.json({
    webhookUrl: doc?.webhookUrl ?? null,
    systemPrompt: doc?.systemPrompt ?? null,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { webhookUrl, systemPrompt } = (await req.json()) as {
    webhookUrl?: string;
    systemPrompt?: string;
  };

  const client = await clientPromise;
  await client
    .db()
    .collection("settings")
    .updateOne(
      { userId },
      {
        $set: {
          webhookUrl: webhookUrl ?? null,
          systemPrompt: systemPrompt ?? null,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

  return NextResponse.json({ success: true });
}
