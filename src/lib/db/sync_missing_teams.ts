import 'dotenv/config';
import { getTeamFromTBA } from "./teams";
import { mysqlPool } from "./mysql";

// NOTE: This script will fetch ALL FRC teams from The Blue Alliance (TBA),
// compare against teams stored in frclink_info, and insert any that are missing.
// It also fetches social media links per team (via getTeamFromTBA) and stores them in frclink_links.
// Be mindful of TBA rate limits; we use a small concurrency limit.

// If you have a different key, consider wiring an env var and updating teams.ts accordingly.
const TBA_KEY = process.env.TBA_KEY || "";

type SimpleTeam = {
  team_number: number;
  nickname: string | null;
  city: string | null;
  state_prov: string | null;
  country: string | null;
};

async function fetchAllTeamNumbers(): Promise<number[]> {
  const headers = { "X-TBA-Auth-Key": TBA_KEY } as Record<string, string>;
  const teamNums: number[] = [];
  let page = 0;
  const maxPages = process.env.MAX_PAGES ? Number(process.env.MAX_PAGES) : undefined;
  // TBA returns up to 500 teams per page; stop when an empty array is returned
  while (true) {
    const url = `https://www.thebluealliance.com/api/v3/teams/${page}/simple`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`Failed to fetch teams page ${page}: ${res.status} ${res.statusText}`);
      break;
    }
    const arr = (await res.json()) as SimpleTeam[];
    if (!Array.isArray(arr) || arr.length === 0) {
      break;
    }
    for (const t of arr) {
      if (typeof t.team_number === "number") teamNums.push(t.team_number);
    }
    console.log(`Fetched page ${page} (${arr.length} teams), total so far ${teamNums.length}`);
    page++;
    if (typeof maxPages === "number" && page >= maxPages) break;
  }
  return teamNums;
}

async function main() {
  const pool = await mysqlPool();

  // Read teams already in DB
  const existingRows: any[] = await pool
    .query(`SELECT team_num FROM frclink_info`)
    .then(([rows]) => rows as any[]);
  const existing = new Set<number>(existingRows.map((r) => Number(r.team_num)));
  console.log(`Existing teams in DB: ${existing.size}`);

  // Pull all team numbers from TBA
  const allTeamNums = await fetchAllTeamNumbers();
  console.log(`Total teams reported by TBA: ${allTeamNums.length}`);

  // Compute missing
  const missing = allTeamNums.filter((n) => !existing.has(n));
  // Sort for stable ordering
  missing.sort((a, b) => a - b);
  console.log(`Teams missing from DB: ${missing.length}`);

  if (missing.length === 0) {
    console.log("No missing teams to sync. Done.");
    return;
  }

  // Concurrency control
  const concurrency = process.env.CONCURRENCY ? Math.max(1, Number(process.env.CONCURRENCY)) : 3; // keep low to respect TBA rate limits (each team requires 2 API calls)
  let idx = 0;
  let insertedInfo = 0;
  let insertedLinks = 0;
  let skipped = 0;
  let failed = 0;
  const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
  const limitTeams = process.env.LIMIT_TEAMS ? Number(process.env.LIMIT_TEAMS) : undefined;

  async function worker(workerId: number) {
    while (true) {
      const i = idx++;
      if (i >= missing.length) return;
      if (typeof limitTeams === "number" && i >= limitTeams) return;
      const teamNum = missing[i];
      try {
        const team = await getTeamFromTBA(teamNum);
        if (!team || !team.info || team.info.length === 0) {
          console.warn(`No TBA data for team ${teamNum}, skipping`);
          skipped++;
          continue;
        }
        const info = team.info[0];

        // Insert info row
        if (!dryRun) {
          await pool.query(
            "INSERT INTO frclink_info (team_num, team_full_name, pfp, description, uid, primary_col, secondary_col, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              teamNum,
              info.team_full_name,
              info.pfp,
              info.description,
              -1,
              info.primary_color,
              info.secondary_color,
              info.location,
            ]
          );
        }
        insertedInfo++;

        // Insert links
        if (Array.isArray(team.links)) {
          for (const link of team.links) {
            try {
              if (!dryRun) {
                await pool.query(
                  "INSERT INTO frclink_links (team_num, icon, description, url, uid, title) VALUES (?, ?, ?, ?, ?, ?)",
                  [teamNum, link.icon, link.description, link.url, -1, link.title]
                );
              }
              insertedLinks++;
            } catch (e) {
              console.warn(`Worker ${workerId} - Failed to insert link for team ${teamNum}:`, e);
            }
          }
        }
        if ((insertedInfo + skipped + failed) % 25 === 0) {
          console.log(
            `Progress: ${i + 1}/${missing.length} processed | info: ${insertedInfo} links: ${insertedLinks} skipped: ${skipped} failed: ${failed}`
          );
        }
      } catch (e) {
        failed++;
        console.error(`Worker ${workerId} - Failed to sync team ${teamNum}:`, e);
      }
    }
  }

  // Start workers
  const workers = Array.from({ length: concurrency }, (_, k) => worker(k + 1));
  await Promise.all(workers);

  console.log(
    `Done. Inserted info for ${insertedInfo} teams, ${insertedLinks} links. Skipped ${skipped}, failed ${failed}.`
  );
}

main().catch((e) => {
  console.error("Fatal error in sync_missing_teams:", e);
  process.exitCode = 1;
});
