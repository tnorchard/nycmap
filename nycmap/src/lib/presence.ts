import { createAdminClient } from "@/lib/supabase/admin";

const ONLINE_WINDOW_SEC = 45;

export async function heartbeatPresence(visitorId: string, isNewVisitor: boolean) {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const cutoff = new Date(Date.now() - ONLINE_WINDOW_SEC * 1000).toISOString();

  await admin.from("nycmap_presence").upsert({ visitor_id: visitorId, last_seen: now });
  await admin.from("nycmap_presence").delete().lt("last_seen", cutoff);

  if (isNewVisitor) {
    const { data } = await admin.from("nycmap_site_stats").select("total_visitors").eq("id", 1).maybeSingle();
    const next = Number(data?.total_visitors ?? 0) + 1;
    await admin.from("nycmap_site_stats").upsert({ id: 1, total_visitors: next });
  }

  const [{ count }, stats] = await Promise.all([
    admin.from("nycmap_presence").select("visitor_id", { count: "exact", head: true }).gte("last_seen", cutoff),
    admin.from("nycmap_site_stats").select("total_visitors").eq("id", 1).maybeSingle(),
  ]);

  return {
    online: count ?? 1,
    visitors: Number(stats.data?.total_visitors ?? 0),
  };
}

export async function readPresence() {
  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - ONLINE_WINDOW_SEC * 1000).toISOString();
  const [{ count }, stats] = await Promise.all([
    admin.from("nycmap_presence").select("visitor_id", { count: "exact", head: true }).gte("last_seen", cutoff),
    admin.from("nycmap_site_stats").select("total_visitors").eq("id", 1).maybeSingle(),
  ]);
  return {
    online: count ?? 0,
    visitors: Number(stats.data?.total_visitors ?? 0),
  };
}
