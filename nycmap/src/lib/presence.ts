import { createAdminClient } from "@/lib/supabase/admin";

const ONLINE_WINDOW_SEC = 45;

function assertOk<T>(label: string, result: { data: T | null; error: { message: string } | null }) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }
  return result.data;
}

export async function heartbeatPresence(visitorId: string) {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const cutoff = new Date(Date.now() - ONLINE_WINDOW_SEC * 1000).toISOString();

  assertOk(
    "presence upsert",
    await admin.from("nycmap_presence").upsert({ visitor_id: visitorId, last_seen: now }, { onConflict: "visitor_id" })
  );

  assertOk("presence cleanup", await admin.from("nycmap_presence").delete().lt("last_seen", cutoff));

  assertOk("register visitor", await admin.rpc("nycmap_register_visitor", { p_visitor_id: visitorId }));

  const onlineResult = await admin
    .from("nycmap_presence")
    .select("visitor_id", { count: "exact", head: true })
    .gte("last_seen", cutoff);
  if (onlineResult.error) {
    throw new Error(`presence count: ${onlineResult.error.message}`);
  }

  const stats = assertOk(
    "site stats",
    await admin.from("nycmap_site_stats").select("total_visitors").eq("id", 1).maybeSingle()
  ) as { total_visitors: number } | null;

  return {
    online: onlineResult.count ?? 1,
    visitors: Number(stats?.total_visitors ?? 0),
  };
}

export async function readPresence() {
  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - ONLINE_WINDOW_SEC * 1000).toISOString();

  const onlineResult = await admin
    .from("nycmap_presence")
    .select("visitor_id", { count: "exact", head: true })
    .gte("last_seen", cutoff);
  if (onlineResult.error) {
    throw new Error(`presence count: ${onlineResult.error.message}`);
  }

  const stats = assertOk(
    "site stats",
    await admin.from("nycmap_site_stats").select("total_visitors").eq("id", 1).maybeSingle()
  ) as { total_visitors: number } | null;

  return {
    online: onlineResult.count ?? 0,
    visitors: Number(stats?.total_visitors ?? 0),
  };
}
