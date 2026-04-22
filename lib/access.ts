import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hasRemoteAccessGrant, recordAccessGrant } from "@/lib/supabase";

export interface AccessGrantRecord {
  email: string;
  source: string;
  externalId?: string;
  grantedAt: string;
}

interface AccessStore {
  grants: AccessGrantRecord[];
}

const ACCESS_FILE = path.join(process.cwd(), "data", "access-grants.json");
const COOKIE_NAME = "pts_paid";
const COOKIE_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSigningSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "dev-signing-secret-change-me";
}

async function readAccessStore(): Promise<AccessStore> {
  try {
    const raw = await readFile(ACCESS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as AccessStore;

    if (!Array.isArray(parsed.grants)) {
      return { grants: [] };
    }

    return parsed;
  } catch {
    return { grants: [] };
  }
}

async function writeAccessStore(store: AccessStore) {
  await mkdir(path.dirname(ACCESS_FILE), { recursive: true });
  await writeFile(ACCESS_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function grantAccess(
  email: string,
  source: string,
  externalId?: string,
): Promise<AccessGrantRecord> {
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date().toISOString();
  const store = await readAccessStore();

  const existing = store.grants.find((grant) => grant.email === normalizedEmail);

  const next: AccessGrantRecord = {
    email: normalizedEmail,
    source,
    externalId,
    grantedAt: existing?.grantedAt ?? now,
  };

  const grantsWithoutEmail = store.grants.filter(
    (grant) => grant.email !== normalizedEmail,
  );

  grantsWithoutEmail.push(next);
  await writeAccessStore({ grants: grantsWithoutEmail });

  await recordAccessGrant(normalizedEmail, source, externalId).catch(() => {
    // Local file still acts as fallback persistence.
  });

  return next;
}

export async function hasAccess(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  if (await hasRemoteAccessGrant(normalizedEmail).catch(() => false)) {
    return true;
  }

  const store = await readAccessStore();

  return store.grants.some((grant) => grant.email === normalizedEmail);
}

function buildSignature(payload: string) {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("hex");
}

export function createPaidCookieValue(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = Date.now() + COOKIE_AGE_SECONDS * 1000;
  const payload = `${normalizedEmail}:${expiresAt}`;
  const signature = buildSignature(payload);

  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function verifyPaidCookie(value?: string | null) {
  if (!value) {
    return { valid: false as const, email: null };
  }

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf-8");
    const [email, expiresAtRaw, signature] = decoded.split(":");

    if (!email || !expiresAtRaw || !signature) {
      return { valid: false as const, email: null };
    }

    const payload = `${email}:${expiresAtRaw}`;
    const expectedSignature = buildSignature(payload);
    const isSignatureValid = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );

    if (!isSignatureValid) {
      return { valid: false as const, email: null };
    }

    const expiresAt = Number(expiresAtRaw);

    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return { valid: false as const, email: null };
    }

    return { valid: true as const, email };
  } catch {
    return { valid: false as const, email: null };
  }
}

export function paidCookieMetadata() {
  return {
    name: COOKIE_NAME,
    maxAge: COOKIE_AGE_SECONDS,
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export const paidCookieName = COOKIE_NAME;
