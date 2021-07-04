module.exports = {
    searchRecordsWithoutImg: async function SearchRecordsWithoutImg(inputDetails, records, sql, config) {

        // ---------------------------------Criminal Search without Image ------------------------------------------------
        // Returns criminal records from DB based on details like FirstName, LastName, Nationality, and Passport No provided by user
        // Output:- [{FirstName:, LastName: , Age: , Gender: , PassportNo: , Nationality: , LocationCity: , Region_where_most_crimes_done: , 
        //  Crimes_done: , Status: , ImgName: }, {}, {}]
        var criminalRecords = records.findMatchingRecord([], inputDetails, sql, config).then((criminalRecords) => { return criminalRecords });
        
        return criminalRecords;
    },

    searchRecordsWithImg: async function searchRecordsWithImg(imgURL, inputDetails, records, sql, client, config, findSimilar) {

        // var imgIds = records.findSimilarFaces(imgURL, client, config, findSimilar).then((imgIds) => { return imgIds });
    
        //Returns criminal recordds based on Similar matched faces and other details like Firstname, LastName, Nationality, and PassportNo 
        //Output:- [{FirstName:, LastName: , Age: , Gender: , PassportNo: , Nationality: , LocationCity: , Region_where_most_crimes_done: , 
        // Crimes_done: , Status: , ImgName: }, {}, {}]


        // var criminalRecordsFromImg = records.findMatchingRecord(imgIds, inputDetails, sql, config).then((criminalRecords) => { return criminalRecords });
        // console.log(criminalRecordsFromImg);


        var criminalRecordsFromImg = records.findSimilarFaces(imgURL, client, sql, config, findSimilar).then(async (imgIds) => { 
            // console.log(imgIds);
            var criminalRecords = [];
            criminalRecords = await records.findMatchingRecord(imgIds, inputDetails, sql, config);
            return criminalRecords;
        });

        //.then((criminalRecords) => { return criminalRecords }
        return criminalRecordsFromImg;
    }
}

