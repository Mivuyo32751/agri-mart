import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { digestToken, updateDatabase } from "../../../../lib/agri-store";
import { SESSION_COOKIE } from "../../../../lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await updateDatabase((database) => { database.sessions = database.sessions.filter((session) => session.tokenHash !== digestToken(token)); });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
