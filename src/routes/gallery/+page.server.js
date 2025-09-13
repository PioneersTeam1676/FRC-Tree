import { mysqlPool } from "$lib/db/mysql";

export async function load() {
    const pool = await mysqlPool();
    try {
        const info = await pool
            .query(`SELECT * FROM frclink_info`)
            .then(([rows]) => rows);
        return { info, loadError: null };
    } catch (err) {
        console.error("Error loading gallery info", err);
        return { info: [], loadError: 'Failed to load gallery data' };
    }
}