import { NextResponse } from "next/server";
import { publicAccount, updateDatabase } from "../../../lib/agri-store";
import { currentAccount } from "../../../lib/auth";

export async function GET() {
  const account = await currentAccount();
  return account ? NextResponse.json({ user: publicAccount(account) }) : NextResponse.json({ error: "Sign in required." }, { status: 401 });
}

export async function PATCH(request: Request) {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const fields = account.role === "farmer"
    ? ["name", "farm", "location", "email"]
    : ["name", "businessName", "location", "email", "phone", "companySize"];
  const updated = await updateDatabase((database) => {
    const user = database.users.find((item) => item.id === account.id);
    if (!user) return null;
    const requestedEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : user.email;
    if (database.users.some((item) => item.id !== user.id && item.email === requestedEmail)) return "email-in-use" as const;
    for (const field of fields) {
      const value = body?.[field];
      if (typeof value === "string") {
        if (field === "name") user.name = value.trim();
        else if (field === "email") user.email = value.trim().toLowerCase();
        else user.profile[field] = value.trim();
      }
    }
    return user;
  });
  if (updated === "email-in-use") return NextResponse.json({ error: "That email is already used by another account." }, { status: 409 });
  return updated ? NextResponse.json({ user: publicAccount(updated) }) : NextResponse.json({ error: "Account not found." }, { status: 404 });
}
