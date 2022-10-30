const txRouter = require('express').Router()
const logger = require('../utils/logger')
const ContractDataCollector = require('../models/contractDataCollector')
const { analyzeTx } = require('../services/analyzer')
const TxDataCollector = require('../models/txDataCollector')


txRouter.post('/', async (request, response) => {
  let dataTx
  let simulation
  if (process.env.MODE === 'static') {
    dataTx = require('../json/txData.json')
    simulation = require('../json/simulation.json')
  }
  else{
    dataTx = new TxDataCollector(request.body)
    await dataTx.populateData()
    dataTx = dataTx.toJSON()
    simulation = await simulateTx(request.body)
  }

  response
    .status(200)
    .json({
      simulation: simulation,
      dataTx: dataTx,
    })
})

module.exports = txRouter
