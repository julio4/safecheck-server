/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT

// Etherscan
const ETHERSCAN_API_ENDPOINT = "https://api.etherscan.io/api"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY 

// INFURA RPC ACCESS
const INFURA_PROVIDER = process.env.INFURA_PROVIDER

// Tenderly
const TENDERLY_USER = process.env.TENDERLY_USER
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT
const TENDERLY_SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`
const TENDERLY_ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY

module.exports = {
  PORT,
  ETHERSCAN_API_KEY,
  ETHERSCAN_API_ENDPOINT,
  INFURA_PROVIDER,
  TENDERLY_SIMULATE_URL,
  TENDERLY_ACCESS_KEY
}
