const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const txRouter = require('./controllers/transactions')
const contractRouter = require('./controllers/contracts')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/v1/tx', txRouter)
app.use('/api/v1/contract', contractRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
