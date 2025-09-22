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
    team_num: number;
    email: string;
    passhash: string;
    salt: string;
    flag_is_admin: number;
}

export function createdThisYear(user: User): boolean {
    // Permanent or regular admins are not time-scoped
    if (user.flag_is_admin === 1) return true;
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
    // Non-admin accounts must be created this calendar year
    if (userRaw.flag_is_admin !== 1 && created.getFullYear() !== new Date().getFullYear()) {
        return undefined;
    }

    const user: User = {
        uid: Number(userRaw.uid),
        created: created,
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
    if (userRaw.flag_is_admin !== 1 && created.getFullYear() !== new Date().getFullYear()) {
        return undefined;
    }

    const user: User = {
        uid: Number(userRaw.uid),
        created: created,
        team_num: Number(userRaw.team_num),
        email: userRaw.email,
        passhash: userRaw.passhash,
        salt: userRaw.salt,
        flag_is_admin: userRaw.flag_is_admin,
    };

    return user;
}

export async function getUserByTeamNum(team_num: number): Promise<User | undefined> {
    const connection = await mysqlConnection();
    const users = await connection
        .query(`SELECT * FROM frclink_users WHERE team_num = ? ORDER BY created DESC LIMIT 1`, team_num)
        .then(([rows, fields]) => {
            return rows;
        });

    if (users.length === 0) {
        return undefined;
    }

    const userRaw = users[0];
    const created = new Date(userRaw.created);
    if (userRaw.flag_is_admin !== 1 && created.getFullYear() !== new Date().getFullYear()) {
        return undefined;
    }

    const user: User = {
        uid: Number(userRaw.uid),
        created: created,
        team_num: Number(userRaw.team_num),
        email: userRaw.email,
        passhash: userRaw.passhash,
        salt: userRaw.salt,
        flag_is_admin: userRaw.flag_is_admin,
    };
    return user;
}

// --- Admin utilities ---
import { randomBytes, createHash } from 'crypto';

/**
 * Ensures a permanent system admin exists (team_num=0, email=system@admin.local).
 * Returns the user (created or existing). Password is randomly generated on first creation and logged to console.
 */
export async function ensureSystemAdmin(): Promise<User> {
    const pool = await mysqlPool();
    const [rows]: any = await pool.query(`SELECT * FROM frclink_users WHERE team_num = 0 AND flag_is_admin = 1 LIMIT 1`);
    const envEmail = process.env.PERM_ADMIN_EMAIL || 'system@admin.local';
    const envPass = process.env.PERM_ADMIN_PASSWORD; // If provided, we may rotate
    if (rows.length > 0) {
        const userRaw = rows[0];
        // Rotate password if explicit env password provided and email matches OR differs and we want to align email
        if (envPass) {
            const salt = randomBytes(16).toString('hex');
            const passhash = createHash('sha256').update(`${envPass}: ${salt}`).digest('hex');
            await pool.query(`UPDATE frclink_users SET email = ?, passhash = ?, salt = ? WHERE uid = ?`, [envEmail, passhash, salt, userRaw.uid]);
            console.log('System admin password rotated from env configuration for uid=' + userRaw.uid);
            userRaw.email = envEmail;
            userRaw.passhash = passhash;
            userRaw.salt = salt;
        }
        return {
            uid: Number(userRaw.uid),
            created: new Date(userRaw.created),
            team_num: Number(userRaw.team_num),
            email: userRaw.email,
            passhash: userRaw.passhash,
            salt: userRaw.salt,
            flag_is_admin: userRaw.flag_is_admin,
        };
    }

    const passwordPlain = envPass || randomBytes(12).toString('hex');
    const salt = randomBytes(16).toString('hex');
    const passhash = createHash('sha256').update(`${passwordPlain}: ${salt}`).digest('hex');
    await pool.query(`INSERT INTO frclink_users (team_num, email, passhash, salt, flag_is_admin, created) VALUES (0, ?, ?, ?, 1, CURRENT_TIMESTAMP())`, [envEmail, passhash, salt]);
    if (!envPass) {
        console.log('System admin created: email=' + envEmail + ' password=' + passwordPlain + ' (store this securely; it will not be shown again)');
    } else {
        console.log('System admin ensured with configured email=' + envEmail);
    }
    const [createdRows]: any = await pool.query(`SELECT * FROM frclink_users WHERE team_num = 0 AND flag_is_admin = 1 LIMIT 1`);
    const userRaw = createdRows[0];
    return {
        uid: Number(userRaw.uid),
        created: new Date(userRaw.created),
        team_num: Number(userRaw.team_num),
        email: userRaw.email,
        passhash: userRaw.passhash,
        salt: userRaw.salt,
        flag_is_admin: userRaw.flag_is_admin,
    };
}

export async function listAdmins(): Promise<User[]> {
    const pool = await mysqlPool();
    const [rows]: any = await pool.query(`SELECT * FROM frclink_users WHERE flag_is_admin = 1 ORDER BY team_num, uid`);
    return rows.map(r => ({
        uid: Number(r.uid),
        created: new Date(r.created),
        team_num: Number(r.team_num),
        email: r.email,
        passhash: r.passhash,
        salt: r.salt,
        flag_is_admin: r.flag_is_admin,
    }));
}

export async function createAdmin(email: string, password: string): Promise<User> {
    const pool = await mysqlPool();
    const salt = randomBytes(16).toString('hex');
    const passhash = createHash('sha256').update(`${password}: ${salt}`).digest('hex');
    await pool.query(`INSERT INTO frclink_users (team_num, email, passhash, salt, flag_is_admin, created) VALUES (0, ?, ?, ?, 1, CURRENT_TIMESTAMP())`, [email, passhash, salt]);
    const [rows]: any = await pool.query(`SELECT * FROM frclink_users WHERE email = ? LIMIT 1`, [email]);
    const r = rows[0];
    return {
        uid: Number(r.uid),
        created: new Date(r.created),
        team_num: Number(r.team_num),
        email: r.email,
        passhash: r.passhash,
        salt: r.salt,
        flag_is_admin: r.flag_is_admin,
    };
}

export async function deleteAdmin(uid: number): Promise<boolean> {
    const pool = await mysqlPool();
    // Protect permanent system admin (team_num=0 with lowest UID) & any user with team_num=0 and email system@admin.local
    const [sysRows]: any = await pool.query(`SELECT uid FROM frclink_users WHERE team_num = 0 AND flag_is_admin = 1 ORDER BY uid ASC LIMIT 1`);
    if (sysRows.length > 0) {
        const protectedUid = Number(sysRows[0].uid);
        if (uid === protectedUid) {
            return false;
        }
    }
    await pool.query(`DELETE FROM frclink_users WHERE uid = ? AND flag_is_admin = 1`, [uid]);
    return true;
}