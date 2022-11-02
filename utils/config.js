/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT
const MODE = process.env.MODE || "DYNAMIC"
const BACALHAU = process.env.BACALHAU || "disabled"

// Transpose
const TRANSPOSE_API_KEY = process.env.TRANSPOSE_API_KEY
const TRANSPOSE_API_ENDPOINT = "https://sql.transpose.io"
const TRANSPOSE_LIMIT = 1000

// Web3 Storage
const WEB3STORAGE_API_KEY = process.env.WEB3STORAGE_API_KEY

// Etherscan
const ETHERSCAN_API_ENDPOINT = "https://api.etherscan.io/api"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY 

// Tenderly
const TENDERLY_USER = process.env.TENDERLY_USER
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT
const TENDERLY_SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`
const TENDERLY_ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY

module.exports = {
  PORT,
  MODE,
  BACALHAU,
  TRANSPOSE_API_KEY,
  TRANSPOSE_API_ENDPOINT,
  TRANSPOSE_LIMIT,
  WEB3STORAGE_API_KEY,
  ETHERSCAN_API_KEY,
  ETHERSCAN_API_ENDPOINT,
  TENDERLY_SIMULATE_URL,
  TENDERLY_ACCESS_KEY
}
