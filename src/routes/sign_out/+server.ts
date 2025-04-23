import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { deleteSession, getSessionBySessionId, type Session } from "$lib/db/sessions";
import { responseError, responseSuccess, HTTP } from "$lib/apis";
import { mysqlConnection, mysqlPool } from "$lib/db/mysql";

export const GET: RequestHandler = async ({ cookies }) => {
    const sessionId = cookies.get("sessionId");
    cookies.set("sessionId", "null", { path: '/' });

    const session: Session | undefined = getSessionBySessionId(sessionId);
    if (!session) {
        return responseSuccess("No session found");
    }

    deleteSession(session);
    return responseSuccess("Signed out");
};