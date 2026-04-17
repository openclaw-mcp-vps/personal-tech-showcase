import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { verifyLemonSignature } from "@/lib/lemonsqueezy";

const PURCHASE_STORE_PATH = path.join(process.cwd(), "data", "purchases.json");

interface PurchaseRecord {
  email: string;
  status: string;
  updatedAt: string;
}

async function loadPurchases(): Promise<Record<string, PurchaseRecord>> {
  try {
    const raw = await readFile(PURCHASE_STORE_PATH, "utf8");
    return JSON.parse(raw) as Record<string, PurchaseRecord>;
  } catch {
    return {};
  }
}

async function savePurchases(data: Record<string, PurchaseRecord>): Promise<void> {
  await mkdir(path.dirname(PURCHASE_STORE_PATH), { recursive: true });
  await writeFile(PURCHASE_STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(request: Request): Promise<NextResponse> {
  const payload = await request.text();
  const signature = request.headers.get("x-signature") ?? "";

  if (!verifyLemonSignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(payload) as {
    meta?: { event_name?: string };
    data?: { attributes?: { user_email?: string; status?: string } };
  };

  const email = event.data?.attributes?.user_email;
  if (!email) {
    return NextResponse.json({ ok: true });
  }

  const purchases = await loadPurchases();
  purchases[email] = {
    email,
    status: event.data?.attributes?.status ?? event.meta?.event_name ?? "active",
    updatedAt: new Date().toISOString(),
  };
  await savePurchases(purchases);

  return NextResponse.json({ ok: true });
}
