module.exports = async function SearchRecords(inputDetails, records, sql, client, config, findSimilar) {


    //Don't touch below code!!!!!(Yet to be implemented)

    // ---------------------------------------Criminal Search With Img -----------------------------------------
    //upload_img_div.getElementsByTagName('img')[0].src
    // if (module.exports.upload_img_div.src != "https://bit.ly/3ubuq5o") {
    //     console.log(upload_img_div.getElementsByTagName('img')[0].src);

    //     var imgIds = records.findSimilarFaces(upload_img_div.getElementsByTagName('img')[0].src, client, config, findSimilar).then((imgIds) => { return imgIds });

    // Returns criminal recordds based on Similar matched faces and other details like Firstname, LastName, Nationality, and PassportNo 
    // Output:- [{FirstName:, LastName: , Age: , Gender: , PassportNo: , Nationality: , LocationCity: , Region_where_most_crimes_done: , 
    //  Crimes_done: , Status: , ImgName: }, {}, {}]
    
    //     var criminalRecordsFromImg = records.findMatchingRecord(imgIds, inputDetails, sql, config).then((criminalRecords) => { return criminalRecords });
    //     return criminalRecordsFromImg;
    // }
        
    // ---------------------------------Criminal Search without Image ------------------------------------------------
    // Returns criminal records from DB based on details like FirstName, LastName, Nationality, and Passport No provided by user
    // Output:- [{FirstName:, LastName: , Age: , Gender: , PassportNo: , Nationality: , LocationCity: , Region_where_most_crimes_done: , 
    //  Crimes_done: , Status: , ImgName: }, {}, {}]
    var criminalRecords = await records.findMatchingRecord([], inputDetails, sql, config).then((criminalRecords) => { return criminalRecords });
    
    return criminalRecords;
}