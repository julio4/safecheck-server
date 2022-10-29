const axios = require('axios')
const { TENDERLY_SIMULATE_URL, TENDERLY_ACCESS_KEY } = require('../utils/config')
const fs = require('fs')

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

  var response
  try {
    //response = await axios.post(TENDERLY_SIMULATE_URL, body, opts);
    let content = fs.readFileSync("./ethorc.json", "utf8");
    console.log(content)
    response.data = JSON.parse(content);
  } catch (error) {
    console.log("An error occured " + error.message)
    process.exit(0)
  }

  return response.data
}

module.exports = {
  simulateTx,
}
