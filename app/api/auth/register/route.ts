import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createSessionToken, digestToken, hashPassword, updateDatabase } from "../../../../lib/agri-store";
import { SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(request: Request) {
  const input = await request.json().catch(() => null) as { role?: string; name?: string; email?: string; password?: string; businessName?: string } | null;
  const name = input?.name?.trim();
  const email = input?.email?.trim().toLowerCase();
  const password = input?.password;
  const role = input?.role;
  if (!name || !email || !password || !["farmer", "enterprise"].includes(role ?? "")) return NextResponse.json({ error: "Complete all required fields and choose a valid account type." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 10 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return NextResponse.json({ error: "Use at least 10 characters, including a letter and a number." }, { status: 400 });
  const token = createSessionToken();
  const account = await updateDatabase((database) => {
    if (database.users.some((user) => user.email === email)) return null;
    const created = { id: randomUUID(), role: role as "farmer" | "enterprise", name, email, passwordHash: hashPassword(password), profile: { ...(role === "enterprise" ? { businessName: input?.businessName?.trim() ?? "" } : {}) }, createdAt: new Date().toISOString(), active: true };
    database.users.push(created);
    database.sessions.push({ tokenHash: digestToken(token), userId: created.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString() });
    if (created.role === "farmer") database.crops[created.id] = [];
    return created;
  });
  if (!account) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  const response = NextResponse.json({ user: { id: account.id, role: account.role, name: account.name, email: account.email, profile: account.profile } }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return response;
}
