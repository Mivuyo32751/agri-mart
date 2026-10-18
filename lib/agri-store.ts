import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type Role = "farmer" | "enterprise" | "admin";
export type Account = { id: string; role: Role; name: string; email: string; passwordHash: string; profile: Record<string, string>; createdAt: string; active?: boolean };
export type Session = { tokenHash: string; userId: string; expiresAt: string };
export type CropRecord = { id: number; name: string; variety: string; field: string; planted: string; harvest: string; stage: string; progress: number; estimate: number; ready: number; quality: string; updated: string; color: string; symbol: string; photo?: string; advertised?: boolean; cropType?: string; cropName?: string; quantity?: number; quantityPlanted?: number; unit?: string; yieldPerUnit?: number; expectedYieldPerUnit?: number; unitYield?: string; daysToHarvest?: number; status?: "planted" | "growing" | "near_harvest"; daysSincePlanting?: number; plantingDate?: string; estimatedHarvestDays?: number; currentAvailableQty?: number; availabilityNotes?: string; notes?: string; farmerId?: string };
export type EnquiryRecord = { id: string; enterpriseId: string; farmerId: string; crop: string; quantity: string; message: string; createdAt: string; status: "new" | "reviewed" };
export type SubscriptionRecord = { id: string; enterpriseId: string; tier: string; status: "requested" | "active" | "inactive"; requestedAt: string; updatedAt: string };
export type ListingReport = { id: string; enterpriseId: string; farmerId: string; cropId: number; reason: string; status: "open" | "reviewed"; createdAt: string };
export type Database = { users: Account[]; sessions: Session[]; crops: Record<string, CropRecord[]>; enquiries: EnquiryRecord[]; subscriptions: SubscriptionRecord[]; listingReports: ListingReport[] };

const dataDirectory = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDirectory, "agri-mart.json");
const emptyDatabase = (): Database => ({ users: [], sessions: [], crops: {}, enquiries: [], subscriptions: [], listingReports: [] });
let writeQueue: Promise<void> = Promise.resolve();

export async function readDatabase(): Promise<Database> {
  try {
    const saved = JSON.parse(await readFile(dataFile, "utf8")) as Partial<Database>;
    return { ...emptyDatabase(), ...saved, listingReports: saved.listingReports 
      ?? [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return emptyDatabase();
  }
}

export async function updateDatabase<T>(update: (database: Database) => T | Promise<T>): Promise<T> {
  let result!: T;
  const operation = writeQueue.then(async () => {
    const database = await readDatabase();
    result = await update(database);
    await mkdir(dataDirectory, { recursive: true });
    const temporaryFile = `${dataFile}.${process.pid}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(database, null, 2), { encoding: "utf8", mode: 0o600 });
    await rename(temporaryFile, dataFile);
  });
  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, savedHash: string): boolean {
  const [salt, saved] = savedHash.split(":");
  if (!salt || !saved) return false;
  const expected = Buffer.from(saved, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const createSessionToken = () => randomBytes(32).toString("base64url");
export const digestToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function findAccountForToken(token: string): Promise<Account | null> {
  const database = await readDatabase();
  const digest = digestToken(token);
  const session = database.sessions.find((item) => item.tokenHash === digest && Date.parse(item.expiresAt) > Date.now());
  if (!session) return null;
  const account = database.users.find((user) => user.id === session.userId) ?? null;
  return account?.active === false ? null : account;
}

export function publicAccount(account: Account) {
  const { passwordHash: _passwordHash, ...safeAccount } = account;
  return safeAccount;
}
