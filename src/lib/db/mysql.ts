import mysql from "mysql2/promise";
import CREDS from "./db.json"

let connection = null;
let pool = null;

export function mysqlPool() {
    if (!pool) {
        // CREDS looks like 
        // export default {
        // host: ***
        // user: ***
        // password: ***
        // database: ***
        // }
        // CREDS.enableKeepAlive = true;
        // CREDS.connectionLimit = 20;

        pool = mysql.createPool(CREDS);
    }
    return pool;
}

export function mysqlConnection() {

    if (!connection) {

        // CREDS looks like 
        // export default {
        // host: ***
        // user: ***
        // password: ***
        // database: ***
        // }
        connection = mysql.createConnection(CREDS);

    }

    return connection;

}

export type User = {
    uid: number;
    created: Date;
    joincodeid: number;
    team_num: number;
    email: string;
    passhash: string;
    salt: string;
    flag_is_admin: number;
}

export function createdThisYear(user: User): boolean {
    return user.created.getFullYear() === new Date().getFullYear();
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const connection = await mysqlConnection();
    const accounts = await connection
        .query(`SELECT * FROM frclink_users WHERE email = ? LIMIT 1`, email)
        .then(([rows, fields]) => {
            return rows;
        });

    if (accounts.length == 0) {
        return undefined;
    }

    const userRaw = accounts[0];
    console.log(accounts);
    console.log(userRaw);

    // check the created date was made this calendar year
    const created = new Date(userRaw.created);
    if (created.getFullYear() !== new Date().getFullYear()) {
        return undefined;
    }

    const user: User = {
        uid: Number(userRaw.uid),
        created: created,
        joincodeid: Number(userRaw.joincodeid),
        team_num: Number(userRaw.team_num),
        email: userRaw.email,
        passhash: userRaw.passhash,
        salt: userRaw.salt,
        flag_is_admin: userRaw.flag_is_admin,
    };

    return user;
}

export async function getUserByUID(uid: number): Promise<User | undefined> {

    const connection = await mysqlConnection();
    const users = await connection
        .query(`SELECT * FROM frclink_users WHERE uid = ? LIMIT 1`, uid)
        .then(([rows, fields]) => {
            return rows;
        });

    if (users.length == 0) {
        return undefined;
    }

    const userRaw = users[0];

    // check the created date was made this calendar year
    const created = new Date(userRaw.created);
    if (created.getFullYear() !== new Date().getFullYear()) {
        return undefined;
    }

    const user: User = {
        uid: Number(userRaw.uid),
        created: created,
        joincodeid: Number(userRaw.joincodeid),
        team_num: Number(userRaw.team_num),
        email: userRaw.email,
        passhash: userRaw.passhash,
        salt: userRaw.salt,
        flag_is_admin: userRaw.flag_is_admin,
    };

    return user;
}