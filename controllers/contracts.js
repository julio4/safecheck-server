const contractRouter = require('express').Router()
const logger = require('../utils/logger')

const ContractDataCollector = require('../models/contractDataCollector')
const { getContractCalls } = require('../services/eth_requests')
const { addToIPFS } = require('../services/ipfs')

contractRouter.get('/:hash', async (request, response) => {
  const contractHash = request.params.hash

  const contractCollector = new ContractDataCollector(contractHash)

  await contractCollector.populateData()

  const cid = await addToIPFS(calls, contractHash)
  logger.info(`Added tx list to IPFS ${cid}`)

  response
    .status(200)
    .json({
      calls: calls.length,
      cid
    })
})

module.exports = contractRouter
