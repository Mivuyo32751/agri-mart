import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { updateDatabase } from "../../../lib/agri-store";

export async function POST(request: Request) {
  const account = await requireRole(["enterprise"]);
  if (!account) return NextResponse.json({ error: "Enterprise sign-in required." }, { status: 401 });
  const body = await request.json().catch(() => null) as { farmerId?: string; cropId?: number; reason?: string } | null;
  if (!body?.farmerId || !Number.isFinite(body.cropId) || !body.reason?.trim()) return NextResponse.json({ error: "Choose a listing and provide a reason." }, { status: 400 });
  const report = await updateDatabase((database) => {
    const crop = database.crops[body.farmerId!]?.find((item) => item.id === body.cropId && item.advertised !== false);
    if (!crop) return null;
    const created = { id: randomUUID(), enterpriseId: account.id, farmerId: body.farmerId!, cropId: body.cropId!, reason: body.reason!.trim(), status: "open" as const, createdAt: new Date().toISOString() };
    database.listingReports.push(created);
    return created;
  });
  return report ? NextResponse.json({ report }, { status: 201 }) : NextResponse.json({ error: "That listing is no longer available." }, { status: 404 });
}
