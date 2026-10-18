import { NextResponse } from "next/server";
import { publicAccount } from "../../../../lib/agri-store";
import { currentAccount } from "../../../../lib/auth";

export async function GET() {
  const account = await currentAccount();
  return account ? NextResponse.json({ user: publicAccount(account) }) : NextResponse.json({ error: "Sign in required." }, { status: 401 });
}
