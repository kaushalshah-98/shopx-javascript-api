const express = require('express');
const bodyParser = require('body-parser');
const couchbase = require('couchbase');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const cors = require('cors');
const app = express();
const { CONSTANT } = require('../shared/constant');
const url = CONSTANT.URL;
const cluster = new couchbase.Cluster(url);
const niql = couchbase.N1qlQuery;
const port_no = CONSTANT.PORT_NUMBER;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
