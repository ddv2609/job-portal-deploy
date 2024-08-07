require("dotenv").config();

const admin = require("firebase-admin");
const { getDownloadURL } = require("firebase-admin/storage");

const configJsonString = Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString('utf8');
const serviceAccount = JSON.parse(configJsonString);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://job-portal-53233.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { bucket, getDownloadURL, ref: admin.storage.ref };
