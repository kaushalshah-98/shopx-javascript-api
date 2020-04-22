const express = require('express');
const bodyParser = require('body-parser');
const couchbase = require('couchbase');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const cors = require('cors');
const dateformat = require('dateformat');
const app = express();
const { CONSTANT } = require('../shared/constant');
const url = CONSTANT.URL;
const cluster = new couchbase.Cluster(url);
const niql = couchbase.N1qlQuery;
const port_no = CONSTANT.PORT_NUMBER;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

cluster.authenticate('Administrator', 'couchbase');

const bucket = cluster.openBucket(CONSTANT.BUCKET_NAME, (err, res) => {
  if (err) {
    console.log(err);
    throw err;
  } else console.log(bucket._name + ' bucket is opened...');
});

//Exporting the necessary variables
module.exports = { bucket, app, niql, nodemailer, uuid, port_no, dateformat };
