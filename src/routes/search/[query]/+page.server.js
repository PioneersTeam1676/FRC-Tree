import { mysqlConnection, mysqlPool } from "$lib/db/mysql";

export async function load( { params }) {

    // let connection = await mysqlConnection();
    let connection = await mysqlPool();


    try {
        let info = await connection
            .query(`SELECT * FROM frclink_info`)
            .then(([rows, fields]) => {
                // console.log(rows);
                return rows;
            });

        let results = {
            info: info
        };
        return {
            query: params.query,
            data: results
        };
    } catch(error) {
        console.error("we got an error!")
        console.log(error)
        return error;
    }

}