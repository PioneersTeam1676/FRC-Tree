import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { createHashAndSalt } from "$lib/db/sessions";
import { mysqlPool } from "$lib/db/mysql";
import { responseError, responseSuccess, HTTP } from "$lib/apis";

// Open sign-up: no join code required
export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const team_num_raw = body.team_num;
    const email: string = body.email;
    const password: string = body.password;

    // Validate required params
    if (team_num_raw === undefined || team_num_raw === null || email === undefined || password === undefined) {
        return responseError("Missing parameters", HTTP.BAD_REQUEST);
    }

    // team_num can arrive as string or number
    const team_num = Number(team_num_raw);
    if (!Number.isFinite(team_num) || !Number.isSafeInteger(team_num)) {
        return responseError(`team_num (${team_num_raw}) is not a finite and safe integer`, HTTP.BAD_REQUEST);
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return responseError(`email (${email}) is not a valid email address (must pass ${emailRegex})`, HTTP.BAD_REQUEST);
    }

    // Validate password
    if (typeof password !== "string" || password.length < 8) {
        return responseError("password must be at least eight characters long", HTTP.BAD_REQUEST);
    }

    const pool = await mysqlPool();

    // Prevent duplicate accounts by email
    try {
        const existing = await pool
            .query(`SELECT uid FROM frclink_users WHERE email = ? LIMIT 1`, [email])
            .then(([rows]) => rows as any[]);
        if (existing.length > 0) {
            return responseError(`an account with ${email} already exists`, 409);
        }
    } catch (e) {
        console.trace("Error checking for existing user", e);
        return responseError("internal error while checking users", HTTP.INTERNAL_SERVER_ERROR);
    }

    // Hash password and create account
    const { passhash, salt } = createHashAndSalt(password);

    try {
        // Detect if joincodeid column exists and whether it's nullable
        const columns = await pool
            .query(`SHOW COLUMNS FROM frclink_users LIKE 'joincodeid'`)
            .then(([rows]) => rows as any[]);

        const hasJoinCodeId = columns.length > 0;
        const joincodeIsNullable = hasJoinCodeId ? (columns[0].Null === 'YES') : false;

        if (!hasJoinCodeId) {
            // Schema without joincodeid
            await pool.query(
                `INSERT INTO frclink_users (team_num, email, passhash, salt) VALUES (?, ?, ?, ?)`,
                [team_num, email, passhash, salt]
            );
        } else if (joincodeIsNullable) {
            // Include explicit NULL for joincodeid if allowed
            await pool.query(
                `INSERT INTO frclink_users (joincodeid, team_num, email, passhash, salt) VALUES (NULL, ?, ?, ?, ?)`,
                [team_num, email, passhash, salt]
            );
        } else {
            // Column exists and is NOT NULL; try insert without it to use any default, else surface clear guidance
            try {
                await pool.query(
                    `INSERT INTO frclink_users (team_num, email, passhash, salt) VALUES (?, ?, ?, ?)`,
                    [team_num, email, passhash, salt]
                );
            } catch (inner: any) {
                if (inner && (inner.code === 'ER_NO_DEFAULT_FOR_FIELD' || inner.errno === 1364)) {
                    return responseError(
                        "Database requires a non-null joincodeid. To allow open sign-up, make frclink_users.joincodeid nullable or provide a default.",
                        HTTP.INTERNAL_SERVER_ERROR
                    );
                }
                throw inner;
            }
        }
    } catch (e: any) {
        console.trace("Error inserting user", e);
        // Handle duplicate key error gracefully if DB has a unique index
        if (e && (e.code === "ER_DUP_ENTRY" || e.errno === 1062)) {
            return responseError(`an account with ${email} already exists`, 409);
        }
        return responseError("internal error while creating user", HTTP.INTERNAL_SERVER_ERROR);
    }

    return responseSuccess("Successfully created user");
};