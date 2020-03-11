require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const router = require('./controllers/persons')
const middlewares = require('./utils/middlewares')
const config = require('./utils/config')

console.log(`Connecting to ${config.MONGO_URI}`)

mongoose.connect(config.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB: ', err.message))

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('body', req => req.method === 'POST' ? JSON.stringify(req.body) : ' ')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api', router)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app