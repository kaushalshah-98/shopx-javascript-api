const express = require('express')
const bodyParser = require('body-parser')
const couchbase = require('couchbase')
const nodemailer = require('nodemailer')
const uuid = require('uuid')
const cors = require('cors')
const app = express()
const url = 'couchbase://localhost:8091'
const cluster = new couchbase.Cluster(url)
const niql = couchbase.N1qlQuery
const port_no = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

cluster.authenticate('Administrator', 'couchbase')

const bucket = cluster.openBucket('amazecart', (err, res) => {
  if (err) throw err
  else console.log(bucket._name + ' bucket is opened...')
})

//Exporting the necessary variables
module.exports = { bucket, app, niql, nodemailer, uuid, port_no }
