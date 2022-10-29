const txRouter = require('express').Router()
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

  //await dataTx.populateData()

  // validate transaction
  // TODO
  // logger.info("Received tx:")
  // logger.info(dataTx.toJSON())

  // simulate tx
  const simulation = await simulateTx(request.body)
  console.log(JSON.stringify(simulation))
  // await simulateTx(body)

  logger.info("Analyzed tx:")
  logger.info(dataTx.toJSON())

  response
    .status(200)
    .json(dataTx.toInsightsJSON())
})

module.exports = txRouter
