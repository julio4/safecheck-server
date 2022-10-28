/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT

// Tenderly
const TENDERLY_USER = process.env.TENDERLY_USER
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT
const TENDERLY_SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`
const TENDERLY_ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY

module.exports = {
  PORT,
  TENDERLY_SIMULATE_URL,
  TENDERLY_ACCESS_KEY
}
