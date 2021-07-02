const express = require("express");
const path = require("path");
const app = express();
require("./db/conn");
const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const dotenv = require('dotenv');

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

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public")

app.use(express.static(static_path))

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


app.post("/verify-identity/html/searchIdentity.html", async (req, res) => {
	var inputDetails = {
		firstName: req.body.first_name,
		lastName: req.body.last_name,
		nationality: req.body.country,
		passportNo: req.body.passportNo
	};

	var criminalRecords = await searchRecords(inputDetails, records, sql, client, config, findSimilar);
	console.log(criminalRecords);

	res.send(criminalRecords);
	
});