import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { createHashAndSalt } from "$lib/db/sessions";
import { mysqlConnection, mysqlPool } from "$lib/db/mysql";
import { responseError, responseSuccess, HTTP } from "$lib/apis";

export const POST: RequestHandler = async ({ request, params }) => {
    const json: { code: string, team_num: string, email: string, password: string } = await request.json();
    const { code, team_num, email, password } = json;

    // Make sure they sent the params
    if (!email || !team_num || !code || !password) {
        return responseError("Missing parameters", HTTP.BAD_REQUEST);
    }

    // Make sure team_num is a number
    const team_num_conv = Number(team_num);
    if (!Number.isSafeInteger(team_num_conv)) {
        return responseError(`team_num (${team_num}) is not a finite and safe integer`, HTTP.BAD_REQUEST);
    }

    // Make sure email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailRegex.test(email);
    if (!validEmail) {
        return responseError(`email (${email}) is not a valid email address (must pass ${emailRegex})`, HTTP.BAD_REQUEST);
    }

    // Make sure password is valid
    if (password.length < 8) {
        return responseError(`password must be at least eight characters long`, HTTP.BAD_REQUEST);
    }

    let joinCode;
    // const connection = await mysqlConnection();
    let connection = await mysqlPool();
    try {
        let joinCodes = await connection
            .query(`SELECT * FROM frclink_joincodes WHERE code = ? AND team_num = ? AND email = ? LIMIT 1`, [code, team_num, email])
            .then(([rows, fields]) => {
                return rows;
            });
        console.log("Join codes: ");
        console.log(joinCodes);
        if (joinCodes.length == 0) {
            return responseError("No join codes found", HTTP.BAD_REQUEST);
        } else {
            joinCode = joinCodes[0];
        }
    } catch (error) {
        console.trace("Error while fetching join codes");
        console.log(error);
        return responseError(error, HTTP.INTERNAL_SERVER_ERROR);
    }

    // check if it hasn't expired
    const expires = new Date(joinCode.expires);
    const activated = joinCode.activated;
    const now = new Date();

    if (activated != null) {
        return responseError("Join code already used", HTTP.BAD_REQUEST);
    }

    if (now.getTime() > expires.getTime()) {
        return responseError(`Join code expired ${now.getTime() - expires.getTime()}ms ago`, HTTP.BAD_REQUEST);
    }

    const ts = now.toISOString().slice(0, 19).replace('T', ' ');
    // It is valid- activate the join code
    try {
        connection
            .query(`UPDATE frclink_joincodes SET activated = ? WHERE id = ?`, [ts, joinCode.id]);
        console.log("Activated the join code");
    } catch (error) {
        console.trace(error);
        return responseError(error, HTTP.INTERNAL_SERVER_ERROR);
    }

    // Create a user
    const { passhash, salt } = createHashAndSalt(password);
    console.log(passhash, salt);

    try {
        connection.query(`INSERT INTO frclink_users (joincodeid, team_num, email, passhash, salt) VALUES (?, ?, ?, ?, ?)`, [joinCode.id, joinCode.team_num, email, passhash, salt]);
        console.log("Inserted a new user");
    } catch (error) {
        console.trace(error);
        return responseError(error, HTTP.INTERNAL_SERVER_ERROR);
    }

    return responseSuccess("Successfully created user");
};