const txRouter = require('express').Router()
const logger = require('../utils/logger')
const DataCollector = require('../models/dataCollector')
const { analyzeTx } = require('../services/analyzer')

const { simulateTx } = require('../services/simulate')

txRouter.get('/', async (request, response) => {
  response
    .status(200)
    .json(dataTx.toJSON())
})

txRouter.post('/', async (request, response) => {
  const dataTx = new DataCollector(request.body)

  // get some data
  await dataTx.populateData()

  // simulate tx
  // await simulateTx(body)

  logger.info("Analyzed tx:")
  logger.info(dataTx.toJSON())

  response
    .status(200)
    .json(analyzeTx(dataTx.toJSON()))
})

module.exports = txRouter
