const txRouter = require('express').Router()
const Transaction = require('../models/transaction')
const logger = require('../utils/logger')
const DataCollector = require('../models/dataCollector')

const { simulateTx } = require('../services/simulate')

txRouter.get('/', async (request, response) => {
  response
    .status(200)
    .json(dataTx.toJSON())
})

txRouter.post('/', async (request, response) => {
  const dataTx = new DataCollector(request.body)

  await dataTx.populateData()

  // validate transaction
  // TODO
  logger.info("Received tx:")
  logger.info(dataTx.toJSON())

  // simulate tx
  
  // await simulateTx(body)

  response
    .status(200)
    .json(dataTx.toJSON())
})

module.exports = txRouter
