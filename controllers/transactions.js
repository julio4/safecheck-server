const txRouter = require('express').Router()
const Transaction = require('../models/transaction')
const logger = require('../utils/logger')

txRouter.get('/', (request, response) => {
  response.json("API TX v1")
})

txRouter.post('/', async (request, response) => {
  const body = request.body

  response
    .status(200)
    .json({
      "Status": "WIP"
    })
})

module.exports = txRouter
