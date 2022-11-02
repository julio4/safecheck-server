const contractRouter = require('express').Router()
const logger = require('../utils/logger')
const { MODE } = require('../utils/config')

const ContractDataCollector = require('../models/contractDataCollector')

contractRouter.get('/:hash', async (request, response) => {
  let data;

  if (MODE === 'STATIC') {
    data = require('../json/bccOutput.json');
  }

  else {
    const contractHash = request.params.hash;
    const dataCollector = new ContractDataCollector(contractHash);
    await dataCollector.populateData();
    data = dataCollector.toJSON();
  }

  response
    .status(200)
    .json(data);
})

module.exports = contractRouter
