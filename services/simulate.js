const axios = require('axios')
const { TENDERLY_SIMULATE_URL, TENDERLY_ACCESS_KEY } = require('../utils/config')

const simulateTx = async (tx) => {
  const opts = {
    headers: {
      'X-Access-Key': TENDERLY_ACCESS_KEY,
    }
  }
  
  const body = {
    "network_id": "1",
    "from": tx.from,
    "to": tx.to,
    "input": tx.data,
    "gas": Number(tx.gas),
    "gas_price": "0",
    "value": Number(tx.value),

    // simulation config (tenderly specific)
    "save_if_fails": true,
    "save": false,
    "simulation_type": "full"
  }

  const response = await axios.post(TENDERLY_SIMULATE_URL, body, opts);

  const data = response.data()

  return data
}

module.exports = {
  simulateTx,
}
