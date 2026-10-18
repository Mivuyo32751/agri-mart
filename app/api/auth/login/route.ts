import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { digestToken, createSessionToken, hashPassword, updateDatabase, verifyPassword } from "../../../../lib/agri-store";
import { SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as { email?: string; password?: string; role?: string; remember?: boolean } | null;
  const email = input?.email?.trim().toLowerCase();
  if (!email || !input?.password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  const token = createSessionToken();
  const account = await updateDatabase((database) => {
    if (input.role === "admin" && process.env.AGRI_ADMIN_EMAIL?.toLowerCase() === email && process.env.AGRI_ADMIN_PASSWORD && input.password === process.env.AGRI_ADMIN_PASSWORD) {
      let admin = database.users.find((item) => item.email === email);
      if (!admin) {
        admin = { id: randomUUID(), role: "admin", name: "Agri-Mart Administrator", email, passwordHash: hashPassword(input.password!), profile: {}, createdAt: new Date().toISOString() };
        database.users.push(admin);
      }
      if (admin.role !== "admin") return "wrong-role" as const;
      database.sessions.push({ tokenHash: digestToken(token), userId: admin.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString() });
      return admin;
    }
    const user = database.users.find((item) => item.email === email);
    if (!user || !verifyPassword(input.password!, user.passwordHash)) return null;
    if (user.active === false) return "disabled" as const;
    if (input.role && input.role !== user.role) return "wrong-role" as const;
    database.sessions = database.sessions.filter((item) => item.userId !== user.id || Date.parse(item.expiresAt) > Date.now());
    const sessionDuration = input.remember ? 1000 * 60 * 60 * 24 * 14 : 1000 * 60 * 60 * 8;
    database.sessions.push({ tokenHash: digestToken(token), userId: user.id, expiresAt: new Date(Date.now() + sessionDuration).toISOString() });
    return user;
  });
  if (!account) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  if (account === "disabled") return NextResponse.json({ error: "This account is disabled. Contact Agri-Mart support." }, { status: 403 });
  if (account === "wrong-role") return NextResponse.json({ error: `This account is registered as an ${input.role === "enterprise" ? "enterprise" : "farmer"}. Use the matching sign-in page.` }, { status: 403 });
  const response = NextResponse.json({ user: { id: account.id, role: account.role, name: account.name, email: account.email, profile: account.profile } });
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", ...(input.remember ? { maxAge: 60 * 60 * 24 * 14 } : {}) });
  return response;
}
