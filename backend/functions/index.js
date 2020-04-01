require('module-alias/register')
const functions = require('firebase-functions');
// process.env.NODE_ENV = 'prod'
require('dotenv').config({ path: '../env/.env.prod' })
console.log(functions.config().env)
const functions_env = functions.config().env
for (let key in functions_env) {
    process.env[key] = functions_env[key];
}
console.log("process.env.node_env =", process.env.NODE_ENV)

const express = require('express');
const app = require('@src/app');

// const app = express();
// [END import]

// [START middleware]
const cors = require('cors')({ origin: true });
app.use(cors);
// [END middleware]


// Define the Firebase function that will act as Express application
// Note: This `api` must match with `/firebase.json` rewrites rule.
exports.api = functions.https.onRequest(app);


/**
 * Say hello API
 * Try: https://mock-apis-server.firebaseapp.com/say/hello
 */
// app.get('/home', (req, res) => {
//     // Return success response
//     return res.status(200).json({ "message": "Hello there... Welcome to mock server." });
// });
/* [END `/say/hello` ] - must be added before `exports.api = ...` */



// const server = require('../server');





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });