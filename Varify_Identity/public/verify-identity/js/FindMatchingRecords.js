module.exports = {

    queryDB: async function makeQueryToDB(connect, query, outputArray) {
        const pool = await connect;

        const results = await pool.request().query(query);

        results.recordset.forEach(record => {
            outputArray.push(record);
        });

    },

    searchDBWithImgIds: async function searchDBWithImgIds(connect, imgId, outputArray, inputDetails) {
        try {
            var searchQuery;

            if(inputDetails.passportNo != "") {
                searchQuery = `select FirstName, LastName, Age, Gender, PassportNo, Nationality, LocationCity, Region_where_most_crimes_done, Crimes_done, Status, ImageName
                            from [dbo].[Criminal_Info] c inner join Criminal_bg c_bg on c.id = c_bg.CriminalInfo_id inner join CriminalImage_data c_img on c_bg.CriminalInfo_id = c_img.CriminalInfo_id
                            where c_img.persistentFaceId = '${imgId}' and c.FirstName = '${inputDetails.firstName}' and c.LastName = '${inputDetails.lastName}' and c.Nationality = '${inputDetails.nationality}' and c.PassportNo = '${inputDetails.passportNo}'`;
            } else {
                searchQuery = `select FirstName, LastName, Age, Gender, PassportNo, Nationality, LocationCity, Region_where_most_crimes_done, Crimes_done, Status, ImageName
                            from [dbo].[Criminal_Info] c inner join Criminal_bg c_bg on c.id = c_bg.CriminalInfo_id inner join CriminalImage_data c_img on c_bg.CriminalInfo_id = c_img.CriminalInfo_id
                            where c_img.persistentFaceId = '${imgId}' and c.FirstName = '${inputDetails.firstName}' and c.LastName = '${inputDetails.lastName}' and c.Nationality = '${inputDetails.nationality}'`;
            }
            
            await module.exports.queryDB(connect, searchQuery, outputArray);
        }
        catch(err) {
            console.log('SQL error', err);
        }
    },

    searchDBWithoutImgIds: async function searchDBWithoutImgIds(connect, outputArray, inputDetails) {
        try {
            if(inputDetails.passportNo != "") {
                var searchQuery = `select FirstName, LastName, Age, Gender, PassportNo, Nationality, LocationCity, Region_where_most_crimes_done, Crimes_done, Status, ImageName
                from [dbo].[Criminal_Info] c inner join Criminal_bg c_bg on c.id = c_bg.CriminalInfo_id inner join CriminalImage_data c_img on c_bg.CriminalInfo_id = c_img.CriminalInfo_id
                where c.FirstName = '${inputDetails.firstName}' and c.LastName = '${inputDetails.lastName}' and c.Nationality = '${inputDetails.nationality}' and c.PassportNo = '${inputDetails.passportNo}';`;

            } else {
                var searchQuery = `select FirstName, LastName, Age, Gender, PassportNo, Nationality, LocationCity, Region_where_most_crimes_done, Crimes_done, Status, ImageName
                               from [dbo].[Criminal_Info] c inner join Criminal_bg c_bg on c.id = c_bg.CriminalInfo_id inner join CriminalImage_data c_img on c_bg.CriminalInfo_id = c_img.CriminalInfo_id
                               where c.FirstName = '${inputDetails.firstName}' and c.LastName = '${inputDetails.lastName}' and c.Nationality = '${inputDetails.nationality}';`;
            }
            
            await module.exports.queryDB(connect, searchQuery, outputArray);
        
        }
        catch(err) {
            console.log('SQL error', err);
        }
    },

    findMatchingRecord: async function FindMatchingRecord(imgIds, inputDetails, sql, config) {

        const sqlConnect = new sql.ConnectionPool(config).connect().then(pool => {
            console.log('Connected to MSSQL!!');
            return pool;
        }).catch(err => console.log('Database Connection Failed! Bad Config: ', err));


        //Query will be done based on inputDetails Object and this Function will return all Information as array of Objects from two tables:
        // 1.Criminal_Info 2.Criminal_bg
        
        var criminalRecords = [];

        if(imgIds.length != 0) {
            imgIds.forEach(async id => {
                await module.exports.searchDBWithImgIds(sqlConnect, id, criminalRecords, inputDetails);
            });
        } else {
            await module.exports.searchDBWithoutImgIds(sqlConnect, criminalRecords, inputDetails);
        }

        // console.log(criminalRecords);
        // connect.close();

        return criminalRecords;
    },


    findSimilarFaces: async function FindSimilarFaces(inputImgUrl, client, config, findSimilar) {
        let results = await findSimilar.findSimilar(inputImgUrl, client, config);

        var imgIds = [];

        if(results.length != 0) {
            results.forEach(Face => {
                imgIds.push(Face.persistedFaceId);
            });
        }
        return imgIds;
    }
}