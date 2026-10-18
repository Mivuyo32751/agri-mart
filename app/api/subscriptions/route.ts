import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { readDatabase, updateDatabase } from "../../../lib/agri-store";

const tiers = ["Essentials", "Insights", "Network"];

export async function GET() {
  const account = await requireRole(["enterprise"]);
  if (!account) return NextResponse.json({ error: "Enterprise sign-in required." }, { status: 401 });
  const database = await readDatabase();
  return NextResponse.json({ subscription: database.subscriptions.find((item) => item.enterpriseId === account.id) ?? null });
}

export async function POST(request: Request) {
  const account = await requireRole(["enterprise"]);
  if (!account) return NextResponse.json({ error: "Enterprise sign-in required." }, { status: 401 });
  const body = await request.json().catch(() => null) as { tier?: string } | null;
  if (!body?.tier || !tiers.includes(body.tier)) return NextResponse.json({ error: "Choose a valid enterprise tier." }, { status: 400 });
  const subscription = await updateDatabase((database) => {
    const current = database.subscriptions.find((item) => item.enterpriseId === account.id);
    if (current) { current.tier = body.tier!; current.status = "requested"; current.updatedAt = new Date().toISOString(); return current; }
    const created = { id: randomUUID(), enterpriseId: account.id, tier: body.tier!, status: "requested" as const, requestedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    database.subscriptions.push(created);
    return created;
  });
  return NextResponse.json({ subscription }, { status: 201 });
}
