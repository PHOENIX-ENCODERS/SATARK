// const sql = require('mssql');
// const config = require('./DatabaseConnectionConfig.js');
// const { v4 : uuidv4} = require('uuid');

// const large_face_list_id = uuidv4();
// const large_face_list_name = 'CriminalFaceData';

module.exports = async function getLargeFaceListId(sql, config) {
    console.log("Connecting to Azure sql server...");

    const sqlConnect = new sql.ConnectionPool(config).connect().then(pool => {
        console.log('Connected to MSSQL!!');
        return pool;
    }).catch(err => console.log('Database Connection Failed! Bad Config: ', err));

    const getQuery = `select LargeFaceListId from LargefaceList_Info`;

    console.log("Retrieving LargeFaceListId....");
    var large_face_list_id = '';
    
    try {
        // const request = connect.request();

        const pool = await sqlConnect;

        const results = await pool.request().query(getQuery);
        // console.log(results);

        //Just a single record in database but I have to do this :(
        results.recordset.forEach(largefacelist => {
            large_face_list_id = largefacelist.LargeFaceListId;
        });
    }
    catch(err) {
        console.error('SQL error', err);
    }

    // connect.close();
    // console.log(large_face_list_id);
    return large_face_list_id;
}


async function updateLargeFaceListId(sql, config, largefacelistid, largefacelistname) {
    console.log("Connecting to Azure sql server...");

    const connect = new sql.ConnectionPool(config);
    const sqlConnect = connect.connect();

    const updateQuery = `update LargeFaceList_Info set LargeFaceListId = '${largefacelistid}' where LargefaceListName = '${largefacelistname}'`;

    console.log("Retrieving LargeFaceListId....");

    await sqlConnect;
    try {
        const request = connect.request();
        const result = await request.query(updateQuery);
        console.log(result);
    }
    catch(err) {
        console.error('SQL error', err);
    }

    // connect.close();
}

// updateLargeFaceListId(config, large_face_list_id, large_face_list_name);