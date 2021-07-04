const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const sql = require('mssql');
const config = require('./DatabaseConnectionConfig.js');
require('dotenv').config();

key = process.env.COGNITIVE_SERVICE_KEY;
endpoint = process.env.COGNITIVE_SERVICE_ENDPOINT;
// console.log(key);
// console.log(endpoint);

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key' : key}});
const client = new Face.FaceClient(credentials, endpoint);

const base_img_url = "https://criminalfacematch.blob.core.windows.net/criminal-face-dataset/";

var large_face_list_id;
const large_face_list_name = "CriminalFaceData";

async function getLargeFaceListid() {
    large_face_list_id = await require('./Get_Update_LargeFaceList_id.js')(config);
    console.log("LargeFaceListId: " + large_face_list_id);
}

const target_image_file_names = ["MohammedAtta.png", "Mohammedrafeeq.png", "MohdShafique.jpg", "MuhsinMusaMatwalliAtwah.png"]; // These functions will be run on our database images. Hence we will fetch all these images from db.

function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateImagedata_table(persistantFaceId, image_file_name) {
    const connect = new sql.ConnectionPool(config);
    const sqlConnect = connect.connect();

    await sqlConnect;

    try {
        const request = connect.request();
        const result = await request.query(`update CriminalImage_data set persistentFaceId = '${persistantFaceId}'
        where ImageName = '${image_file_name}'`);
        // console.log(result);
    }
    catch(err) {
        console.error('SQL error', err);
    } 
    console.log("Done updating DB....");
}

async function AddFacesToLargeFaceList(target_image_file_names, large_face_list_id) {
    console.log("Adding images to LargeFaceList.....");

    await Promise.all( target_image_file_names.map ( async function(image_file_name) {
        let persistedFace = await client.largeFaceList.addFaceFromUrl(large_face_list_id, base_img_url + image_file_name); // Could cause issue on largeFaceList.faceId
        console.log("Added " + image_file_name + " with persistedFaceId: " + persistedFace.persistedFaceId + " to LargeFaceList.");
        updateImagedata_table(persistedFace.persistedFaceId, image_file_name);
    }));

    console.log("Done adding faces to LargeFaceList");
}

async function CreateAndTrainLargeFaceList() {
    console.log("Creating a LargeFaceList with Id: " + large_face_list_id);

    // await client.largeFaceList.create(large_face_list_id, { name: large_face_list_name, recognitionModel: 'recognition_04'});
    await AddFacesToLargeFaceList(target_image_file_names, large_face_list_id);  // This func will be initially run on our Db images.
    console.log();
    sleep(2000);
    console.log("Training LargeFaceList: " + large_face_list_id + ".");

    await client.largeFaceList.train(large_face_list_id);
    console.log();
}

async function main() {
    await getLargeFaceListid();
    await CreateAndTrainLargeFaceList();
}

main();