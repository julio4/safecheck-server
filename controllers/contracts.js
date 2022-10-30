const contractRouter = require('express').Router()
const logger = require('../utils/logger')

const ContractDataCollector = require('../models/contractDataCollector')
const { getContractCalls } = require('../services/eth_requests')
const { addToIPFS } = require('../services/ipfs')
const { getContractInfo, callBacalhau, localBac } = require('../services/bacalhau')

contractRouter.get('/:hash', async (request, response) => {
  const contractHash = request.params.hash
  const addressRe = /^0x[a-fA-F0-9]{40}$/;
  // if (!addressRe.test(contractHash)) {
  //   response
  //     .status(400)
  //     .json({
  //       "error": "Address in url is incorrect"
  //     });
  //   return;
  // }

  // const contractInfo = await getContractInfo(contractHash);

  //if (contractInfo === null) {
    const calls = await getContractCalls(contractHash);
    // const cid = await addToIPFS(calls, contractHash)
    // console.log(`Added tx list to IPFS ${cid}. Launching bacalhau job.`);
    // callBacalhau(contractHash, cid);
    const data = await localBac(calls);
    response.status(404).json(localBac);
    return;
  //}

  const contractInfo = await getContractInfo(contractHash);
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
