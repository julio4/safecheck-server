const axios = require('axios')
const Web3 = require('web3')

const { ETHERSCAN_API_ENDPOINT, ETHERSCAN_API_KEY, INFURA_PROVIDER } = require("../utils/config")

// ETHERSCAN API
const getContractCreationData = async (contractAddr) => {
  const response = await axios.get(ETHERSCAN_API_ENDPOINT, {
    params: {
      module: 'contract',
      action: 'getcontractcreation',
      contractaddresses: contractAddr,
      apikey: ETHERSCAN_API_KEY
    }
  })

  if (response.data.status === "1") {
    let contractCreationHash = response.data.result[0].txHash
    const creationDate = await getContractCreationDate(contractCreationHash)

    return {
      status: creationDate.status,
      contractCreator: response.data.result[0].contractCreator,
      contractCreationHash,
      creationTimestamp: creationDate.creationTimestamp
    }
  }
  return { status: 0 }
}

// WEB3 JS x INFURA
const getContractCreationDate = async (contractCreationHash) => {
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER))
    let creationTxData = await web3.eth.getTransaction(contractCreationHash)
    let blockData = await web3.eth.getBlock(creationTxData.blockHash)
    return {
      status: 1,
      creationTimestamp: blockData.timestamp
    }
  } catch(e) {
    return { status: 0 }
  }
}

// ETHERSCAN API
const getContractCalls = async (contractAddr) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER))
  const latest = await web3.eth.getBlockNumber()
  const averageBlockForOneMonth = parseInt(60 * 60 * 24 * 30 / 12)

  const response = await axios.get(ETHERSCAN_API_ENDPOINT, {
    params: {
      module: 'logs',
      action: 'getLogs',
      fromBlock: latest - averageBlockForOneMonth,
      toBlock: latest,
      page: "1",
      offset: "1000",
      address: contractAddr,
      apikey: ETHERSCAN_API_KEY
    }
  })

  // todo handle response
  return response.data
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
  getContractCreationData,
  getContractCalls,
  getIfItsVerified
}
