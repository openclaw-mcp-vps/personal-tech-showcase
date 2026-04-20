import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { z } from "zod";

const paymentRecordSchema = z.object({
  status: z.enum(["pending", "paid"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  username: z.string().nullable().optional(),
  orderId: z.string().nullable().optional(),
  customerEmail: z.string().nullable().optional()
});

const paymentStoreSchema = z.record(z.string(), paymentRecordSchema);

type PaymentStore = z.infer<typeof paymentStoreSchema>;

const storePath = path.join(process.cwd(), "data", "payments.json");

async function ensureStore() {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, "{}", "utf8");
  }
}

async function readStore(): Promise<PaymentStore> {
  await ensureStore();

  const raw = await fs.readFile(storePath, "utf8");
  const parsed = paymentStoreSchema.safeParse(JSON.parse(raw));

  return parsed.success ? parsed.data : {};
}

async function writeStore(store: PaymentStore) {
  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export function createCheckoutToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function recordCheckoutIntent(
  token: string,
  username: string | null
): Promise<void> {
  const store = await readStore();
  const now = new Date().toISOString();

  store[token] = {
    status: "pending",
    createdAt: now,
    updatedAt: now,
    username
  };

  await writeStore(store);
}

export async function markCheckoutAsPaid(input: {
  token: string;
  orderId?: string | null;
  customerEmail?: string | null;
}) {
  const store = await readStore();
  const existing = store[input.token];

  if (!existing) {
    return;
  }

  store[input.token] = {
    ...existing,
    status: "paid",
    updatedAt: new Date().toISOString(),
    orderId: input.orderId ?? null,
    customerEmail: input.customerEmail ?? null
  };

  await writeStore(store);
}

export async function getCheckoutStatus(token: string | null): Promise<
  "missing" | "pending" | "paid"
> {
  if (!token) return "missing";

  const store = await readStore();
  const record = store[token];

  if (!record) return "missing";
  return record.status;
}
