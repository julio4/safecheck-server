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

  let simulationResult
  let status
  try {
    let response = await axios.post(TENDERLY_SIMULATE_URL, body, opts);
    simulationResult = response.data
    status = 1
  } catch (error) {
    simulationResult = error.response.data
    status = 0
  }

  return {
    status: status,
    data: status ? extractSimulationData(simulationResult) : simulationResult
  }
}

function extractSimulationData(simulation) {
  let result = {}

  let transaction = simulation.transaction
  let balanceDiff = transaction.transaction_info.balance_diff
  let contracts = simulation.contracts
  let stacktrace = transaction.transaction_info.stack_trace
  let error = {}
  // If an error occured, it is stored in the stacktrace in the first element
  if (stacktrace != null) {
    if (stacktrace[0].error != null) { // Error occured
      error["error"] = stacktrace[0].error
      error["error_reason"] = stacktrace[0].error_reason
      error["contract"] = stacktrace[0].contract
      error["code"] = stacktrace[0].code
      error["line"] = stacktrace[0].line
      error["contract_name"] = stacktrace[0].name
      error["op"] = stacktrace[0].op
    }
  }

  result["balance_diff"] = { original: "-1", dirty: "-1" }
  balanceDiff.forEach(diff => {
    if (diff.address.toLowerCase() === transaction.from.toLowerCase()) result["balance_diff"] = diff
  });
  result["error"] = error
  if (contracts[0] != undefined) {
    result["standards"] = contracts[0].standards
    result["token_data"] = contracts[0].token_data
  }
  else {
    result["standards"] = []
    result["token_data"] = {}
  }

  return result
}

module.exports = {
  simulateTx,
}
