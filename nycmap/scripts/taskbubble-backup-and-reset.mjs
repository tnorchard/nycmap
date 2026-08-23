#!/usr/bin/env node
/**
 * Back up TaskBubble Supabase project, zip it, wipe remote data, rename project.
 * Usage: node scripts/taskbubble-backup-and-reset.mjs
 */
import { execSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_REF = "eoqzcogcutrzpboczvmj";
const NEW_NAME = "nycmap";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BACKUP_DIR = path.join(ROOT, "backups", "taskbubble-supabase-2026-08-23");
const ZIP_PATH = path.join(ROOT, "backups", "taskbubble-supabase-2026-08-23.zip");
const MIGRATION_PATH = path.join(
  ROOT,
  "supabase/migrations/20260823075000_create_nycmap_lot_claims.sql"
);

function getAccessToken() {
  try {
    return execSync(
      'security find-generic-password -s "Supabase CLI" -a "supabase" -w',
      { encoding: "utf8" }
    ).trim();
  } catch {
    throw new Error("Supabase CLI access token not found. Run: npx supabase login");
  }
}

async function api(pathname, { method = "GET", body } = {}) {
  const token = getAccessToken();
  const res = await fetch(`https://api.supabase.com/v1${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${pathname} -> ${res.status}: ${text}`);
  }
  return json;
}

async function runQuery(query, readOnly = true) {
  return api(`/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    body: { query, read_only: readOnly },
  });
}

async function listTables(schemas = ["public", "auth", "storage"]) {
  const inList = schemas.map((s) => `'${s}'`).join(", ");
  const rows = await runQuery(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema IN (${inList})
      AND table_type = 'BASE TABLE'
    ORDER BY table_schema, table_name;
  `);
  return rows;
}

async function exportTable(schema, table) {
  const fq = `"${schema}"."${table}"`;
  const countRows = await runQuery(`SELECT COUNT(*)::int AS count FROM ${fq};`);
  const count = countRows[0]?.count ?? 0;
  if (count === 0) {
    return { schema, table, count: 0, rows: [] };
  }
  const rows = await runQuery(`SELECT * FROM ${fq};`);
  return { schema, table, count, rows };
}

async function exportSchemaMetadata() {
  const columns = await runQuery(`
    SELECT table_schema, table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema IN ('public', 'auth', 'storage')
    ORDER BY table_schema, table_name, ordinal_position;
  `);
  const indexes = await runQuery(`
    SELECT schemaname, tablename, indexname, indexdef
    FROM pg_indexes
    WHERE schemaname IN ('public', 'auth', 'storage')
    ORDER BY schemaname, tablename, indexname;
  `);
  const policies = await runQuery(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname IN ('public', 'auth', 'storage')
    ORDER BY schemaname, tablename, policyname;
  `);
  const buckets = await runQuery(`
    SELECT id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at
    FROM storage.buckets
    ORDER BY name;
  `);
  return { columns, indexes, policies, buckets };
}

async function downloadStorage() {
  const storageDir = path.join(BACKUP_DIR, "storage");
  await mkdir(storageDir, { recursive: true });
  try {
    execSync(
      `cd "${ROOT}" && npx supabase storage cp ss:/// "${storageDir}" -r --experimental`,
      { stdio: "pipe", encoding: "utf8" }
    );
    return { downloaded: true };
  } catch (err) {
    const listingPath = path.join(BACKUP_DIR, "storage-listing.txt");
    let listing = "";
    try {
      listing = await readFile(listingPath, "utf8");
    } catch {
      listing = String(err?.stderr || err?.message || err);
    }
    await writeFile(path.join(BACKUP_DIR, "storage-download-error.txt"), listing);
    return { downloaded: false, error: String(err?.message || err) };
  }
}

async function zipBackup() {
  await mkdir(path.dirname(ZIP_PATH), { recursive: true });
  if (await fileExists(ZIP_PATH)) await rm(ZIP_PATH);
  execSync(`cd "${path.dirname(BACKUP_DIR)}" && zip -r "${ZIP_PATH}" "${path.basename(BACKUP_DIR)}"`, {
    stdio: "inherit",
  });
}

async function fileExists(p) {
  try {
    await readFile(p);
    return true;
  } catch {
    return false;
  }
}

async function wipeProject() {
  const tables = await listTables(["public"]);
  const drops = [];
  for (const { table_schema, table_name } of tables) {
    drops.push(`DROP TABLE IF EXISTS "${table_schema}"."${table_name}" CASCADE;`);
  }
  if (drops.length) {
    await runQuery(drops.join("\n"), false);
  }

  const buckets = await runQuery(`SELECT id, name FROM storage.buckets;`);
  for (const bucket of buckets) {
    try {
      execSync(
        `cd "${ROOT}" && npx supabase storage rm ss:///${bucket.name} -r --experimental --yes 2>/dev/null || true`,
        { stdio: "pipe" }
      );
    } catch {
      /* bucket may already be empty */
    }
    try {
      execSync(
        `cd "${ROOT}" && npx supabase storage rm ss:///${bucket.name} --experimental --yes 2>/dev/null || true`,
        { stdio: "pipe" }
      );
    } catch {
      /* ignore */
    }
  }

  // Remove bucket metadata after objects are gone.
  const remainingBuckets = await runQuery(`SELECT id, name FROM storage.buckets;`);
  for (const bucket of remainingBuckets) {
    try {
      await runQuery(`DELETE FROM storage.buckets WHERE id = '${bucket.id}';`, false);
    } catch {
      /* storage API may still hold the bucket */
    }
  }

  const authUsers = await runQuery(`SELECT id FROM auth.users;`);
  if (authUsers.length) {
    const ids = authUsers.map((u) => `'${u.id}'`).join(", ");
    await runQuery(`DELETE FROM auth.users WHERE id IN (${ids});`, false);
  }

  const remainingPublic = await listTables(["public"]);
  const remainingBucketsAfter = await runQuery(`SELECT name FROM storage.buckets;`);
  return {
    remainingPublicTables: remainingPublic.length,
    remainingBuckets: remainingBucketsAfter.length,
    remainingAuthUsers: (await runQuery(`SELECT COUNT(*)::int AS count FROM auth.users;`))[0]
      ?.count,
  };
}

async function renameProject() {
  return api(`/projects/${PROJECT_REF}`, {
    method: "PATCH",
    body: { name: NEW_NAME },
  });
}

async function applyNycmapMigration() {
  const sql = await readFile(MIGRATION_PATH, "utf8");
  await runQuery(sql, false);
}

async function main() {
  const step = process.argv[2] || "all";
  await mkdir(BACKUP_DIR, { recursive: true });

  if (step === "backup" || step === "all") {
    console.log("Listing tables...");
    const tables = await listTables();
    await writeFile(path.join(BACKUP_DIR, "tables.json"), JSON.stringify(tables, null, 2));

    console.log("Exporting schema metadata...");
    const metadata = await exportSchemaMetadata();
    await writeFile(path.join(BACKUP_DIR, "schema-metadata.json"), JSON.stringify(metadata, null, 2));

    console.log(`Exporting ${tables.length} tables...`);
    const exports = [];
    for (const { table_schema, table_name } of tables) {
      process.stdout.write(`  ${table_schema}.${table_name}... `);
      const data = await exportTable(table_schema, table_name);
      const file = path.join(BACKUP_DIR, "data", `${table_schema}.${table_name}.json`);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, JSON.stringify(data, null, 2));
      console.log(data.count, "rows");
      exports.push({ schema: table_schema, table: table_name, count: data.count });
    }
    await writeFile(path.join(BACKUP_DIR, "export-summary.json"), JSON.stringify(exports, null, 2));

    console.log("Downloading storage...");
    const storageResult = await downloadStorage();
    await writeFile(
      path.join(BACKUP_DIR, "storage-download-result.json"),
      JSON.stringify(storageResult, null, 2)
    );

    console.log("Creating zip...");
    await zipBackup();
    console.log(`Backup zip: ${ZIP_PATH}`);
  }

  if (step === "wipe" || step === "all") {
    console.log("Wiping project data...");
    const wipeResult = await wipeProject();
    await writeFile(path.join(BACKUP_DIR, "wipe-result.json"), JSON.stringify(wipeResult, null, 2));
    console.log("Wipe result:", wipeResult);
  }

  if (step === "setup" || step === "all") {
    console.log("Renaming project...");
    const renamed = await renameProject();
    await writeFile(path.join(BACKUP_DIR, "rename-result.json"), JSON.stringify(renamed, null, 2));
    console.log("Renamed to:", renamed?.name || NEW_NAME);

    console.log("Applying NYC MAP migration...");
    await applyNycmapMigration();
    console.log("Migration applied.");
  }

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
