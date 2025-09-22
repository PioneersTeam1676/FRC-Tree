import { mysqlConnection } from "$lib/db/mysql";
import { getTeamFromDB, getTeamFromTBA } from "$lib/db/teams";
import { error, redirect } from "@sveltejs/kit";

export async function load({ params }) {

    // check if team is a number
    const teamNum = Number(params.id);
    if (!Number.isInteger(teamNum)) {
        throw error(404, 'Team parameter must be a non-empty string with no whitespace');
    }

    let team = await getTeamFromDB(teamNum);
    let autofilled = false;
    if (!team) {
        // Only hit TBA if we have absolutely no stored team info
        team = await getTeamFromTBA(teamNum);
        autofilled = true;
    }
    
    return {
        data: {
            links: team.links,
            info: team.info,
            autofilled
        }
    };

}