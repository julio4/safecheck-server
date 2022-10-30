const txRouter = require('express').Router()
const logger = require('../utils/logger')
const TxDataCollector = require('../models/txDataCollector')
const { analyzeTx } = require('../services/analyzer')

txRouter.post('/', async (request, response) => {
  logger.info('\n\nSTARTING...')
  const dataTx = new TxDataCollector(request.body)

  await dataTx.populateData()

  // simulate tx
  const simulation = await simulateTx(request.body)

  // logger.info("Analyzed tx:")
  // logger.info(dataTx.toJSON())

  response
    .status(200)
    .json({
      simulation: simulation,
      dataTx: dataTx.toJSON(),
    })
})

module.exports = txRouter
