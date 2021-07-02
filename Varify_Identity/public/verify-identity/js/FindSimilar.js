module.exports = {

    detectFaceRecognize: async function DetectFaceRecognize(url, client) {
        let detectedFaces = await client.face.detectWithUrl(url,
            {
                detectionModel: 'detection_03',
                recognitionModel: 'recognition_04'
            })
        return detectedFaces;
    },

    getLargeFaceListId: async function getLargeFaceListid(config) {
        var large_face_list_id = await require('./Get_Update_LargeFaceList_id.js')(config); // Could cause issues
        console.log("LargeFaceListId: " + large_face_list_id);
        return large_face_list_id;
    },

    findSimilar: async function FindSimilar(source_img_url, FaceClient, DatabaseConfig) {
        console.log("========FIND SIMILAR========");
        console.log();

        // const source_image_file_name = "https://criminalfacematch.blob.core.windows.net/face-input-data/input_img_1.png";

        var large_face_list_id = await module.exports.getLargeFaceListId(DatabaseConfig);

        let detected_face = await module.exports.detectFaceRecognize(source_img_url);

        let results = await FaceClient.face.findSimilar(detected_face[0].faceId, { largeFaceListId: large_face_list_id }); // error here

        // results.forEach(function (result) {
        //     console.log("Faces from :" + source_image_file_name + " and ID: " + result.persistedFaceId + " are similar with confidence: " + result.confidence + ".");
        // }); 
        return results;
    }
}
// FindSimilar();