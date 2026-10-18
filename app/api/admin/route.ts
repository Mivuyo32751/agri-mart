import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { publicAccount, readDatabase, updateDatabase } from "../../../lib/agri-store";

export async function GET() {
  const admin = await requireRole(["admin"]);
  if (!admin) return NextResponse.json({ error: "Administrator sign-in required." }, { status: 403 });
  const database = await readDatabase();
  return NextResponse.json({
    users: database.users.map(publicAccount),
    listings: database.users.filter((user) => user.role === "farmer").flatMap((user) => (database.crops[user.id] ?? []).map((crop) => ({ ...crop, farmerId: user.id, farmerName: user.profile.farm || user.name, advertised: crop.advertised !== false }))),
    subscriptions: database.subscriptions,
    enquiries: database.enquiries,
    listingReports: database.listingReports.map((report) => ({ ...report, farmerName: database.users.find((user) => user.id === report.farmerId)?.profile.farm || database.users.find((user) => user.id === report.farmerId)?.name || "Removed farmer", enterpriseName: database.users.find((user) => user.id === report.enterpriseId)?.profile.businessName || "Enterprise" })),
  });
}

export async function PATCH(request: Request) {
  const admin = await requireRole(["admin"]);
  if (!admin) return NextResponse.json({ error: "Administrator sign-in required." }, { status: 403 });
  const body = await request.json().catch(() => null) as { type?: string; farmerId?: string; cropId?: number; advertised?: boolean; subscriptionId?: string; status?: string; enquiryId?: string; userId?: string; active?: boolean; reportId?: string } | null;
  const result = await updateDatabase((database) => {
    if (body?.type === "listing") {
      const crop = database.crops[body.farmerId ?? ""]?.find((item) => item.id === body.cropId);
      if (!crop) return null;
      crop.advertised = body.advertised === true;
      return crop;
    }
    if (body?.type === "account" && typeof body.userId === "string" && typeof body.active === "boolean") {
      const user = database.users.find((item) => item.id === body.userId && item.role !== "admin");
      if (!user) return null;
      user.active = body.active;
      if (!body.active) database.sessions = database.sessions.filter((session) => session.userId !== user.id);
      return user;
    }
    if (body?.type === "subscription" && ["active", "inactive", "requested"].includes(body.status ?? "")) {
      const subscription = database.subscriptions.find((item) => item.id === body.subscriptionId);
      if (!subscription) return null;
      subscription.status = body.status as "active" | "inactive" | "requested";
      subscription.updatedAt = new Date().toISOString();
      return subscription;
    }
    if (body?.type === "enquiry" && body.status === "reviewed") {
      const enquiry = database.enquiries.find((item) => item.id === body.enquiryId);
      if (!enquiry) return null;
      enquiry.status = "reviewed";
      return enquiry;
    }
    if (body?.type === "report" && body.status === "reviewed") {
      const report = database.listingReports.find((item) => item.id === body.reportId);
      if (!report) return null;
      report.status = "reviewed";
      return report;
    }
    return undefined;
  });
  if (result === undefined) return NextResponse.json({ error: "Unsupported admin action." }, { status: 400 });
  return result ? NextResponse.json({ result }) : NextResponse.json({ error: "Record not found." }, { status: 404 });
}
