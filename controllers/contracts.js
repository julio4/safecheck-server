const contractRouter = require('express').Router()
const logger = require('../utils/logger')

const ContractDataCollector = require('../models/contractDataCollector')
const { getContractCalls } = require('../services/eth_requests')
const { addToIPFS } = require('../services/ipfs')
const { getContractInfo, callBacalhau, localBac } = require('../services/bacalhau')

contractRouter.get('/:hash', async (request, response) => {
  let dataTx
  let data
  if (process.env.MODE === 'static') {
    dataTx = require('../json/contractData.json')
    data = require('../json/bccOutput.json')
  }
  else {
    const contractHash = request.params.hash
    const calls = await getContractCalls(contractHash);
    data = await localBac(contractHash, calls);
    dataTx = new ContractDataCollector(contractHash)
    await dataTx.populateData()
    dataTx = dataTx.toJSON()
  }

  response
    .status(200)
    .json({ bacalhau: data, dataTx: dataTx })
})

module.exports = contractRouter
