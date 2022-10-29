const txRouter = require('express').Router()
const logger = require('../utils/logger')
const TxDataCollector = require('../models/txDataCollector')
const { analyzeTx } = require('../services/analyzer')

const { simulateTx } = require('../services/simulate')

txRouter.post('/', async (request, response) => {
  const dataTx = new TxDataCollector(request.body)

  await dataTx.populateData()

  // validate transaction

  // simulate tx
  const simulation = await simulateTx(request.body)

  logger.info("Analyzed tx:")
  logger.info(dataTx.toJSON())
  logger.info(JSON.stringify(simulation))

  response
    .status(200)
    .json(analyzeTx(dataTx.toJSON()))
})

module.exports = txRouter
