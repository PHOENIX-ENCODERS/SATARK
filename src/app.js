const express = require("express");
const path = require("path");
const app = express();
require("./db/conn");
const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const dotenv = require('dotenv');
const { BlobServiceClient } = require('@azure/storage-blob');

dotenv.config({ path: '/.env' });

key = process.env.COGNITIVE_SERVICE_KEY;
const endpoint = "https://criminalfacematching.cognitiveservices.azure.com/";

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key' : key}});
const client = new Face.FaceClient(credentials, endpoint);

const sql = require('mssql');
const config = require('../public/verify-identity/js/DatabaseConnectionConfig.js');

const searchRecords = require('../public/verify-identity/js/index.js');
const findSimilar = require('../public/verify-identity/js/FindSimilar.js');
const records = require('../public/verify-identity/js/FindMatchingRecords.js');
const containerName = 'face-input-data';
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('file-1');
const getStream = require('into-stream');
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const blobOperations = require('../public/verify-identity/js/Upload_Delete_ImageBlob.js');
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public")

app.use(express.static(static_path))

const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; //here too
// app.get("/", (req, res) => {
//   res.send("hello from satark");
// });
app.use(express.urlencoded());

app.use(express.json());

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.listen(port, () => {
	console.log(`server is running at port no ${port}`);
});


app.post("/verify-identity/html/searchIdentity.html", uploadStrategy, async (req, res) => {
	var inputDetails = {
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		nationality: req.body.country,
		passportNo: req.body.passportNo
	};

	var criminalRecords = [];

	if(!req.hasOwnProperty('file')) {
		criminalRecords = await searchRecords.searchRecordsWithoutImg(inputDetails, records, sql, config);
	}
	else {
		const fileName = req.file.originalname;

		// console.log(fileName);

		const stream = getStream(req.file.buffer);

		await blobOperations.uploadImg(BlobServiceClient, fileName, uploadOptions, stream, containerName);
		var imgURL = blobOperations.getImgUrl(storageAccountName, containerName, fileName);

		criminalRecords = await searchRecords.searchRecordsWithImg(imgURL, inputDetails, records, sql, client, config, findSimilar);
	}

	res.send(criminalRecords);
	
});