import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { getSessionBySessionId, type Session } from "$lib/db/sessions";
import { responseError, responseSuccess, HTTP } from "$lib/apis";
import { mysqlConnection } from "$lib/db/mysql";

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

    const json = await request.json();
    const { team_full_name, pfp, description, primary_col, secondary_col, location } = json;
    console.log(json);

    const connection = await mysqlConnection();
    connection.query("UPDATE frclink_info SET team_full_name = ?, pfp = ?, description = ?, primary_col = ?, secondary_col = ?, location = ? WHERE team_num = ?", [
        team_full_name, pfp, description, primary_col, secondary_col, location, team
    ]);

    return responseSuccess("Temporary", {});
};