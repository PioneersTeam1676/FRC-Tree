import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { getSessionBySessionId, type Session } from "$lib/db/sessions";
import { responseError, responseSuccess, HTTP } from "$lib/apis";
import { mysqlConnection, mysqlPool } from "$lib/db/mysql";

export const POST: RequestHandler = async ({ request, cookies, params }) => {
    const sessionId = cookies.get("sessionId");
    const teamNotNumber = params.id;
    const team = Number(teamNotNumber);

    if (!Number.isInteger(team)) {
        return responseError(`team ${team} is not an integer`, HTTP.BAD_REQUEST);
    }
    
    const session: Session | undefined = getSessionBySessionId(sessionId);
    if (!session) {
        return responseError(`invalid sessionid`, HTTP.UNAUTHORIZED);
    }
    
    const teamAuthorized = session.team_num;
    const admin = session.user.flag_is_admin === 1;
    
    if (teamAuthorized === -1 && !admin) {
        return responseError(`invalid sessionid`, HTTP.UNAUTHORIZED);
    }

    if (teamAuthorized !== team && !admin) {
        return responseError(`session not authorized for that team`, HTTP.UNAUTHORIZED);
    }

    const body = await request.json();
    const { team_full_name, pfp, description, primary_col, secondary_col, location, links = [], deletedIds = [] } = body;
    console.log(body);

    const pool = await mysqlPool();

    // Upsert team info (create row if missing)
    try {
        const [rows]: any = await pool.query(`SELECT team_num FROM frclink_info WHERE team_num = ? LIMIT 1`, [team]);
        if (rows.length === 0) {
            await pool.query(
                `INSERT INTO frclink_info (team_num, team_full_name, pfp, description, primary_col, secondary_col, location, uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [team, team_full_name ?? '', pfp ?? '', description ?? '', primary_col ?? '#00c3ff', secondary_col ?? '#111111', location ?? '', session.uid]
            );
        } else {
            await pool.query(
                `UPDATE frclink_info SET team_full_name = ?, pfp = ?, description = ?, primary_col = ?, secondary_col = ?, location = ? WHERE team_num = ?`,
                [team_full_name ?? '', pfp ?? '', description ?? '', primary_col ?? '#00c3ff', secondary_col ?? '#111111', location ?? '', team]
            );
        }
    } catch (e) {
        console.trace("Error upserting team info", e);
        return responseError("failed to save team info", HTTP.INTERNAL_SERVER_ERROR);
    }

    // Delete removed links
    if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        try {
            await pool.query(
                `DELETE FROM frclink_links WHERE id IN (${deletedIds.map(() => '?').join(',')}) AND team_num = ?`,
                [...deletedIds, team]
            );
        } catch (e) {
            console.trace("Error deleting links", e);
            return responseError("failed to delete links", HTTP.INTERNAL_SERVER_ERROR);
        }
    }

    // Upsert links from payload
    if (Array.isArray(links)) {
        for (const link of links) {
            const { id, title = '', description = '', url = '', icon = '' } = link ?? {};
            try {
                if (id) {
                    await pool.query(
                        `UPDATE frclink_links SET title = ?, description = ?, url = ?, icon = ?, uid = ? WHERE id = ? AND team_num = ?`,
                        [title, description, url, icon, session.uid, id, team]
                    );
                } else {
                    await pool.query(
                        `INSERT INTO frclink_links (team_num, icon, description, url, uid, title) VALUES (?, ?, ?, ?, ?, ?)`,
                        [team, icon, description, url, session.uid, title]
                    );
                }
            } catch (e) {
                console.trace("Error upserting link", e);
                return responseError("failed to save links", HTTP.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Fetch refreshed info & links so client can immediately reflect persisted state (with new link IDs)
    try {
        const [infoRows]: any = await pool.query(`SELECT * FROM frclink_info WHERE team_num = ? LIMIT 1`, [team]);
        const [linkRows]: any = await pool.query(`SELECT * FROM frclink_links WHERE team_num = ? ORDER BY id ASC`, [team]);
        return responseSuccess("Saved changes", { info: infoRows, links: linkRows });
    } catch (e) {
        console.trace("Error fetching refreshed data", e);
        return responseSuccess("Saved changes", {}); // fallback (still report success; client can reload manually)
    }
};