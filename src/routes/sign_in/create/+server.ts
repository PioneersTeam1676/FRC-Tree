import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { createHashAndSalt, createSessionForUser, hashAndSaltPassword } from "$lib/db/sessions";
import { getUserByEmail, getUserByTeamNum, mysqlConnection, mysqlPool, type User } from "$lib/db/mysql";
import { responseError, responseSuccess, HTTP } from "$lib/apis";

export const POST: RequestHandler = async ({ request, params, cookies }) => {
    const json = await request.json();
    // Accept either email or team number via 'identifier'
    const { identifier, email, password } = json;

    const idValue = identifier || email; // backwards compatibility

    // return responseError("Disabled", HTTP.NOT_IMPLEMENTED);

    // Make sure they sent the params
    if (!idValue) {
        return responseError("Missing identifier (email or team number)", HTTP.BAD_REQUEST);
    }

    if (!password) {
        return responseError("Missing password parameter", HTTP.BAD_REQUEST);
    }

    let account: User | undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const looksLikeEmail = emailRegex.test(idValue);
    if (looksLikeEmail) {
        account = await getUserByEmail(idValue);
    } else {
        const asNumber = Number(idValue);
        if (!Number.isSafeInteger(asNumber)) {
            return responseError(`identifier (${idValue}) must be a valid email or integer team number`, HTTP.BAD_REQUEST);
        }
        account = await getUserByTeamNum(asNumber);
    }

    // Make sure password is valid
    if (password.length < 8) {
        return responseError(`password must be at least eight characters long`, HTTP.BAD_REQUEST);
    }

    if (!account) {
        return responseError(`no account found with that identifier`, HTTP.NOT_FOUND);
    }

    // Check password
    const correctPasshash = account.passhash;
    const givenPasshash = hashAndSaltPassword(password, account.salt);
    console.log("Given: " + givenPasshash)
    if (correctPasshash !== givenPasshash) {
        return responseError(`incorrect password`, HTTP.UNAUTHORIZED);
    }

    // Create a session
    try {
        const session = await createSessionForUser(account);
        cookies.set("sessionId", session.sessionId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "strict",
            path: "/"
        });
        
        return responseSuccess(`success`);
    } catch (e) {
        return responseError(e, HTTP.INTERNAL_SERVER_ERROR);
    }

};