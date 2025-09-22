import { mysqlPool } from './mysql';

// Backfill script: Assign GitHub icon to any frclink_links rows whose URL contains github.com but icon is empty.
// Run with:  npx tsx src/lib/db/backfill_github_icons.ts

const githubIcon = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic-00.iconduck.com%2Fassets.00%2Fgithub-icon-2048x2048-91rgqivh.png&f=1&nofb=1&ipt=5c842f4ec230f47f6ca5a6b41360b7ca6506a575212d7d72c95a62f126b713b3&ipo=images";

async function main() {
  const pool = await mysqlPool();
  const [rows] = await pool.query(
    "SELECT id, url, icon, title FROM frclink_links WHERE (icon IS NULL OR icon = '') AND url LIKE '%github.com%'"
  );
  const links: any[] = rows as any[];
  if (links.length === 0) {
    console.log('No GitHub links without icons found.');
    return;
  }
  console.log(`Found ${links.length} GitHub links missing icons. Updating...`);
  let updated = 0;
  for (const l of links) {
    try {
      const newTitle = (!l.title || l.title === '' || l.title === l.url) ? 'GitHub' : l.title;
      await pool.query("UPDATE frclink_links SET icon = ?, title = ? WHERE id = ?", [githubIcon, newTitle, l.id]);
      updated++;
    } catch (e) {
      console.error('Failed to update link id', l.id, e);
    }
  }
  console.log(`Updated ${updated}/${links.length} links with GitHub icon.`);
}

main().catch(e => { console.error(e); process.exitCode = 1; });
