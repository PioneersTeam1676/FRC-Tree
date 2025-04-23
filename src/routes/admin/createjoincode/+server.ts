import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { createHashAndSalt, createSessionForUser, hashAndSaltPassword } from "$lib/db/sessions";
import { getUserByEmail, mysqlConnection, mysqlPool, type User } from "$lib/db/mysql";
import { responseError, responseSuccess, HTTP } from "$lib/apis";

import { randomBytes } from "crypto";

function makeCode() {
    return `frc-${randomBytes(8).toString("hex")}`;
}

export const POST: RequestHandler = async ({ request, params }) => {
    const json = await request.json();
    const { email, team, expires } = json;

    if (!email) {
        return responseError("no email provided", HTTP.BAD_REQUEST);
    }

    if (!team) {
        return responseError("no team provided", HTTP.BAD_REQUEST);
    }

    if (!expires) {
        return responseError("no expires provided", HTTP.BAD_REQUEST);
    }

    const expiresfmt = new Date(expires).toISOString().slice(0, 19).replace('T', ' ');
    // const connection = await mysqlConnection();
    let connection = await mysqlPool();
    connection.query("INSERT INTO frclink_joincodes (code, created, expires, team_num, email) VALUES (?, CURRENT_TIMESTAMP(), ?, ?, ?)", [
        makeCode(), expiresfmt, team, email
    ]);
    
    return responseSuccess("created join code", HTTP.CREATED);
};