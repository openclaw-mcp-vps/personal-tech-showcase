import { createClient } from "@supabase/supabase-js";

import type { PortfolioConfig } from "@/types/portfolio";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function getSupabaseServiceClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}

export async function savePortfolioConfig(config: PortfolioConfig) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { persisted: false, reason: "Supabase service role is not configured." } as const;
  }

  const { error } = await supabase.from("portfolio_configs").upsert(config, {
    onConflict: "username"
  });

  if (error) {
    return { persisted: false, reason: error.message } as const;
  }

  return { persisted: true } as const;
}
