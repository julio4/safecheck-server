const axios = require('axios')
const logger = require('../utils/logger')
const RequestError = require('../errors/requestError');

const {
  ETHERSCAN_API_KEY,
  ETHERSCAN_API_ENDPOINT,
  TRANSPOSE_API_ENDPOINT,
  TRANSPOSE_API_KEY,
  TRANSPOSE_LIMIT
} = require("../utils/config")

const getContractData = async (contractAddr) => {
  let response = undefined 
  try {
    response = await axios.post(TRANSPOSE_API_ENDPOINT, {
      sql: `SELECT * FROM ethereum.accounts WHERE address='${contractAddr}' LIMIT 1;`
    }, {
      headers: {
        'x-api-key': TRANSPOSE_API_KEY,
        'content-type': 'application/json'
      }
    })
  } catch (e) {
    logger.error(e.message)
    throw new RequestError("Transpose API")
  }

  return response.data.results[0]
}

const getContractCalls = async (contractAddr) => {
  let response = undefined 
  try {
    response = await axios.post(TRANSPOSE_API_ENDPOINT, {
      sql: `SELECT timestamp, block_number, from_address, value, __confirmed FROM ethereum.transactions WHERE to_address='${contractAddr}' ORDER BY block_number DESC LIMIT ${TRANSPOSE_LIMIT};`
    }, {
      headers: {
        'x-api-key': TRANSPOSE_API_KEY,
        'content-type': 'application/json'
      }
    })
  } catch (e) {
    throw new RequestError("Transpose API")
  }
  return response.data.results
}

const getContractCallsCount = async (contractAddr) => {
  // we limit response to speed up snaps loading time 
  let response = undefined 
  try {
    response = await axios.post(TRANSPOSE_API_ENDPOINT, {
      sql: `SELECT timestamp, block_number, from_address, value, __confirmed FROM ethereum.transactions WHERE to_address='${contractAddr}' LIMIT ${TRANSPOSE_LIMIT};`
    }, {
      headers: {
        'x-api-key': TRANSPOSE_API_KEY,
        'content-type': 'application/json'
      }
    })
  } catch (e) {
    throw new RequestError("Transpose API")
  }
  return response.data.results.length
}

const getIfItsVerified = async (contractAddr) => {
  const response = await axios.get(ETHERSCAN_API_ENDPOINT, {
    params: {
      module: 'contract',
      action: 'getsourcecode',
      address: contractAddr,
      apikey: ETHERSCAN_API_KEY
    }
  })
  return response.data.result[0].ABI === "Contract source code not verified" ? false : true;
}

module.exports = {
  getContractData,
  getContractCalls,
  getContractCallsCount,
  getIfItsVerified
}
