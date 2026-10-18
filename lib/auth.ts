import { cookies } from "next/headers";
import { findAccountForToken, type Account, type Role } from "./agri-store";

export const SESSION_COOKIE = "agri_mart_session";
export async function currentAccount(): Promise<Account | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? findAccountForToken(token) : null;
}

export async function requireRole(roles: Role[]) {
  const account = await currentAccount();
  return account && roles.includes(account.role) ? account : null;
}
