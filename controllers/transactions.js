const txRouter = require('express').Router()
const Transaction = require('../models/transaction')
const logger = require('../utils/logger')

const { simulateTx } = require('../services/simulate')

txRouter.get('/', (request, response) => {
  response.json({
    "status": "Success!"
  })
})

txRouter.post('/', async (request, response) => {
  const tx = request.body

  // validate transaction
  // TODO
  logger.info("Received tx:")
  logger.info(tx)  

  // construct insights object
  let insights = {
    "Status": "Received",
  }

  // simulate tx
  
  // await simulateTx(body)

  response
    .status(200)
    .json(insights)
})

module.exports = txRouter
