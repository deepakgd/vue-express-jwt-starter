require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path');
const PORT = process.env.PORT || 3000;
const ADDRESS = process.env.ADDRESS || '0.0.0.0'
const ENV = process.env;


const app = express()

require('./app/lib/db')(mongoose);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', require('./app/routes'));

app.use('/', express.static(__dirname + '/dist'))

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
