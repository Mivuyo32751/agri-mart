import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { readDatabase, updateDatabase } from "../../../lib/agri-store";

export async function GET() {
  const account = await requireRole(["farmer", "enterprise"]);
  if (!account) return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
  const database = await readDatabase();
  const enquiries = database.enquiries.filter((item) => account.role === "farmer" ? item.farmerId === account.id : item.enterpriseId === account.id).map((item) => {
    const supplier = database.users.find((user) => user.id === item.farmerId);
    const enterprise = database.users.find((user) => user.id === item.enterpriseId);
    return { ...item, supplierName: supplier?.profile.farm || supplier?.name || item.farmerId, enterpriseName: enterprise?.profile.businessName || enterprise?.name || "Enterprise buyer" };
  });
  return NextResponse.json({ enquiries });
}

export async function POST(request: Request) {
  const account = await requireRole(["enterprise"]);
  if (!account) return NextResponse.json({ error: "Enterprise sign-in required." }, { status: 401 });
  const body = await request.json().catch(() => null) as { supplierId?: string; crop?: string; quantity?: string; message?: string } | null;
  if (!body?.supplierId || !body.crop?.trim() || !body.message?.trim()) return NextResponse.json({ error: "Choose a supplier and include a crop and message." }, { status: 400 });
  if (body.quantity && (!Number.isFinite(Number(body.quantity)) || Number(body.quantity) <= 0)) return NextResponse.json({ error: "Enter a valid requested quantity." }, { status: 400 });
  const snapshot = await readDatabase();
  const supplier = snapshot.users.find((user) => user.id === body.supplierId && user.role === "farmer" && user.active !== false);
  if (!supplier || !snapshot.crops[supplier.id]?.some((crop) => crop.name === body.crop && crop.advertised !== false)) return NextResponse.json({ error: "This example listing cannot receive enquiries yet. Choose a registered farmer listing." }, { status: 400 });
  const enquiry = await updateDatabase((database) => {
    const created = { id: randomUUID(), enterpriseId: account.id, farmerId: body.supplierId!, crop: body.crop!.trim(), quantity: body.quantity?.trim() ?? "", message: body.message!.trim(), createdAt: new Date().toISOString(), status: "new" as const };
    database.enquiries.unshift(created);
    return created;
  });
  return NextResponse.json({ enquiry }, { status: 201 });
}
