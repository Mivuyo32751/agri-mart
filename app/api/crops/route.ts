import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { type CropRecord, readDatabase, updateDatabase } from "../../../lib/agri-store";

function productionRecord(crop: CropRecord, farmerId: string, farmLocation: string): CropRecord {
  const status = crop.status ?? (crop.progress <= 12 || crop.stage === "Seedling" ? "planted" : crop.progress >= 90 || crop.stage === "Harvesting" ? "near_harvest" : "growing");
  const daysToHarvest = Number.isFinite(crop.daysToHarvest) && (crop.daysToHarvest ?? 0) > 0 ? crop.daysToHarvest! : 90;
  const derivedDaysSincePlanting = status === "near_harvest" ? Math.max(daysToHarvest - 7, 0) : status === "planted" ? 8 : 28;
  const daysSincePlanting = crop.daysSincePlanting ?? derivedDaysSincePlanting;
  const plantingDate = crop.plantingDate ?? new Date(Date.now() - daysSincePlanting * 86400000).toISOString().slice(0, 10);
  const quantity = Number.isFinite(crop.quantity) && (crop.quantity ?? 0) > 0 ? crop.quantity! : Number(crop.field.match(/([\d.]+)\s*ha\b/i)?.[1] ?? 1);
  const unit = crop.unit ?? "hectares";
  const yieldPerUnit = crop.expectedYieldPerUnit ?? crop.yieldPerUnit ?? Number(((crop.estimate * 1000) / quantity).toFixed(2));
  const notes = crop.notes?.split(" · Farm location:")[0].trim();
  const cropType = crop.cropType ?? (/maize|wheat|barley|sorghum|rice|oat/i.test(crop.name) ? "grain" : /bean|pea|lentil|groundnut/i.test(crop.name) ? "legume" : /apple|citrus|grape|banana|berry|mango/i.test(crop.name) ? "fruit" : /spinach|butternut|tomato|carrot|lettuce|potato|onion|cabbage|pepper/i.test(crop.name) ? "vegetable" : "other");
  return {
    ...crop,
    cropType,
    cropName: crop.name,
    quantity,
    quantityPlanted: crop.quantityPlanted ?? quantity,
    unit,
    yieldPerUnit,
    expectedYieldPerUnit: yieldPerUnit,
    unitYield: crop.unitYield ?? (unit === "hectares" ? "kg/ha" : `kg/${unit}`),
    daysToHarvest,
    status,
    daysSincePlanting,
    plantingDate,
    estimatedHarvestDays: daysToHarvest,
    currentAvailableQty: crop.ready,
    availabilityNotes: status === "near_harvest" ? crop.availabilityNotes ?? "Near harvest. Confirm the sale-ready quantity after harvest." : undefined,
    notes: [notes, `Farm location: ${farmLocation || crop.field}`].filter(Boolean).join(" · "),
    farmerId,
  };
}

export async function GET() {
  const account = await requireRole(["farmer"]);
  if (!account) return NextResponse.json({ error: "Farmer sign-in required." }, { status: 401 });
  const database = await readDatabase();
  return NextResponse.json({ crops: (database.crops[account.id] ?? []).map((crop) => productionRecord(crop, account.id, account.profile.location ?? "")) });
}

export async function PUT(request: Request) {
  const account = await requireRole(["farmer"]);
  if (!account) return NextResponse.json({ error: "Farmer sign-in required." }, { status: 401 });
  const body = await request.json().catch(() => null) as { crops?: CropRecord[] } | null;
  if (!Array.isArray(body?.crops) || body.crops.length > 500) return NextResponse.json({ error: "Provide a valid crop list." }, { status: 400 });
  const crops = body.crops;
  if (crops.some((crop) => !crop || typeof crop.name !== "string" || typeof crop.field !== "string" || !Number.isFinite(crop.progress) || crop.progress < 0 || crop.progress > 100 || !Number.isFinite(crop.estimate) || crop.estimate < 0 || !Number.isFinite(crop.ready) || crop.ready < 0)) return NextResponse.json({ error: "Crop progress and quantity values are invalid." }, { status: 400 });
  if (crops.some((crop) => (crop.quantity !== undefined && (!Number.isFinite(crop.quantity) || crop.quantity < 0)) || (crop.quantityPlanted !== undefined && (!Number.isFinite(crop.quantityPlanted) || crop.quantityPlanted < 0)) || (crop.yieldPerUnit !== undefined && (!Number.isFinite(crop.yieldPerUnit) || crop.yieldPerUnit < 0)) || (crop.expectedYieldPerUnit !== undefined && (!Number.isFinite(crop.expectedYieldPerUnit) || crop.expectedYieldPerUnit < 0)) || (crop.daysToHarvest !== undefined && (!Number.isFinite(crop.daysToHarvest) || crop.daysToHarvest < 1 || crop.daysToHarvest > 730)) || (crop.status !== undefined && !["planted", "growing", "near_harvest"].includes(crop.status)) || (crop.unit !== undefined && !["plants", "kg seed", "hectares", "m2"].includes(crop.unit)))) return NextResponse.json({ error: "Production quantities, units, status, or growing-period values are invalid." }, { status: 400 });
  const records = crops.map((crop) => productionRecord(crop, account.id, account.profile.location ?? ""));
  await updateDatabase((database) => { database.crops[account.id] = records; });
  return NextResponse.json({ crops: records, savedAt: new Date().toISOString() });
}
