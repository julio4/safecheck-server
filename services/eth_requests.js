const axios = require('axios')

const { ETHERSCAN_API_KEY, ETHERSCAN_API_ENDPOINT, TRANSPOSE_API_ENDPOINT, TRANSPOSE_API_KEY } = require("../utils/config")

class RequestError extends Error {
  constructor(message) {
    super(message)
    this.name = "RequestError";
  }
}

const getContractData = async (contractAddr) => {
  let response = undefined 
  try {
    response = await axios.post(TRANSPOSE_API_ENDPOINT, {
      sql: `SELECT * FROM ethereum.accounts WHERE address='${contractAddr}';`
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

const getContractCalls = async (contractAddr) => {
  let response = undefined 
  try {
    response = await axios.post(TRANSPOSE_API_ENDPOINT, {
      sql: `SELECT * FROM ethereum.transactions WHERE to_address='${contractAddr}';`
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

const getIfItsVerified = async (contractAddr) => {
  const response = await axios.get(ETHERSCAN_API_ENDPOINT, {
    params: {
      module: 'contract',
      action: 'getsourcecode',
      address: contractAddr,
      apikey: process.env.ETHERSCAN_API_KEY
    }
  })
  return response.data.result[0].ABI === "Contract source code not verified" ? false : true;
}

module.exports = {
  getContractData,
  getContractCalls,
  getIfItsVerified
}
