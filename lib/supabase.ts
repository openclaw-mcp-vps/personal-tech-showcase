import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { type PortfolioProject } from "@/types/portfolio";

const projectRowSchema = z.object({
  payload: z.custom<PortfolioProject>()
});

let serverClient: SupabaseClient | null = null;

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseServerClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  if (!serverClient) {
    serverClient = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  return serverClient;
}

export async function savePortfolioProjects(
  username: string,
  projects: PortfolioProject[]
): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client || projects.length === 0) return;

  const rows = projects.map((project) => ({
    username,
    project_id: project.id,
    payload: project,
    updated_at: new Date().toISOString()
  }));

  const { error } = await client.from("portfolio_projects").upsert(rows, {
    onConflict: "username,project_id"
  });

  if (error) {
    console.warn("Unable to persist portfolio projects in Supabase:", error.message);
  }
}

export async function readPortfolioProjects(
  username: string
): Promise<PortfolioProject[] | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from("portfolio_projects")
    .select("payload")
    .eq("username", username)
    .order("updated_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  const parsed = data
    .map((row) => projectRowSchema.safeParse(row))
    .filter((result) => result.success)
    .map((result) => result.data.payload);

  return parsed.length > 0 ? parsed : null;
}

export async function saveLemonWebhookEvent(payload: unknown): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) return;

  const { error } = await client.from("subscription_events").insert({
    payload,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.warn("Unable to persist Lemon Squeezy webhook event:", error.message);
  }
}
