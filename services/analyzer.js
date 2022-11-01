const { TRANSPOSE_LIMIT } = require('../utils/config')

// A criteria func take the insights object (with a passed attribute) and tx data
// If the critera pass do nothing, else decrement insights.passed

const c_verified = (insights, { isAVerifiedContract }) => {
  insights.verified = (isAVerifiedContract) ? "Contract verified!" : () => {
    insights.passed--
    return "[WARNING] Contract is NOT verified. Deployer might want to hide malicious functions"
  }
}

const c_ethTransfer = (insights, { value }) => {
  let native_value = Number(value)
  if (native_value > 0) {
    insights.passed--
    insights.value = `[Warning] Value not null! Transfer ${native_value * 10**(-18)} eth`
  }
}

const c_creationDate = (insights, { creationTimestamp }) => {
  let creationTime = new Date(creationTimestamp)
  let elapsedDays = ((new Date()).getTime() - creationTime.getTime()) / (1000*60*60*24)
  insights.date = `Contract was deployed on ${creationTime.toString()}.` 
  if (elapsedDays < 30) {
    insights.passed--
    insights.date += "[WARNING] Deployed less than a month ago."
  }
}

const c_callsCount = (insights, { callsCount }) => {
  if (callsCount >= TRANSPOSE_LIMIT) {
    insights.calls = `>${TRANSPOSE_LIMIT} calls. This contract is used a lot!`
  } else if (callsCount < 100) {
    insights.passed--
    insights.calls = `[WARNING] There were only ${callsCount} calls to this contract. This contract is not used a lot.`
  } else {
    insights.calls = `There were ${callsCount} calls to this contract.`
  }
}

const analyzeTx = (tx) => {
  const criterias = [
    c_verified,
    c_ethTransfer,
    c_creationDate,
    c_callsCount,
    // You can add more criterias here if you want
  ]
  insights = {
    score: undefined, // First one to be show in metamask popup
    passed: criterias.length
  }

  criterias.forEach((c_func) => c_func(insights, tx))

  // Give a global trust score:
  insights.score = `[${insights.passed}/${criterias.length}]`
  let ratio = insights.passed / criterias.length
  if (ratio == 1) {
    insights.score += " => SAFE"
  } else if (ratio > 0.5) {
    insights.score += " => OK (Check warnings)"
  } else {
    insights.score += " => RISKY (Check warnings and be cautious)"
  }

  insights.disclaimer = "These information might not be accurate. Please be careful!"

  return insights
}

module.exports = {
  analyzeTx
}
