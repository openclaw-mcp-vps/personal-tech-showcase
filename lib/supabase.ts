import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RepoSyncResult } from "@/types/portfolio";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cachedPublicClient: SupabaseClient | null = null;
let cachedServiceClient: SupabaseClient | null = null;

function canUsePublicClient() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function canUseServiceClient() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function getSupabasePublicClient() {
  if (!canUsePublicClient()) {
    return null;
  }

  if (!cachedPublicClient) {
    cachedPublicClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
      },
    });
  }

  return cachedPublicClient;
}

export function getSupabaseServiceClient() {
  if (!canUseServiceClient()) {
    return null;
  }

  if (!cachedServiceClient) {
    cachedServiceClient = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
      auth: {
        persistSession: false,
      },
    });
  }

  return cachedServiceClient;
}

export async function upsertPortfolioSnapshot(
  username: string,
  snapshot: RepoSyncResult,
) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return;
  }

  await client
    .from("portfolio_snapshots")
    .upsert(
      {
        username,
        snapshot,
        generated_at: snapshot.generatedAt,
      },
      { onConflict: "username" },
    )
    .throwOnError();
}

export async function readPortfolioSnapshot(username: string) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return null;
  }

  const response = await client
    .from("portfolio_snapshots")
    .select("snapshot")
    .eq("username", username)
    .maybeSingle();

  if (response.error || !response.data?.snapshot) {
    return null;
  }

  return response.data.snapshot as RepoSyncResult;
}

export async function recordAccessGrant(
  email: string,
  source: string,
  externalId?: string,
) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return;
  }

  await client
    .from("access_grants")
    .upsert(
      {
        email: email.toLowerCase(),
        source,
        external_id: externalId ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .throwOnError();
}

export async function hasRemoteAccessGrant(email: string) {
  const client = getSupabaseServiceClient();

  if (!client) {
    return false;
  }

  const response = await client
    .from("access_grants")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  return Boolean(response.data?.email);
}
