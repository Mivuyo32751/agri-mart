import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { readDatabase } from "../../../lib/agri-store";

export async function GET() {
  const account = await requireRole(["enterprise", "admin"]);
  if (!account) return NextResponse.json({ error: "Enterprise sign-in required." }, { status: 401 });
  const database = await readDatabase();
  const subscription = database.subscriptions.find((item) => item.enterpriseId === account.id);
  const canViewInsights = subscription?.status === "active" && ["Insights", "Network"].includes(subscription.tier);
  const suppliers = database.users.filter((user) => user.role === "farmer" && user.active !== false && database.crops[user.id]?.some((crop) => crop.advertised !== false)).map((user) => ({
    id: user.id,
    name: user.profile.farm || user.name,
    contactName: user.name,
    email: user.email,
    location: user.profile.location || "Location not provided",
    crops: (database.crops[user.id] ?? []).filter((crop) => crop.advertised !== false).map((crop) => canViewInsights ? crop : ({ id: crop.id, name: crop.name, variety: crop.variety, field: crop.field, planted: "Subscriber access required", stage: "Subscriber access required", progress: 0, harvest: crop.harvest, estimate: crop.estimate, ready: crop.ready, quality: "Subscriber access required", updated: "" })),
  }));
  return NextResponse.json({ suppliers });
}
