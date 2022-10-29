//From: this.From,
//ContractAddr: this.ContractAddr,
//Gas: this.Gas,
//MaxFeePerGas: this.MaxFeePerGas,
//MaxPriorityFeePerGas: this.MaxPriorityFeePerGas,
//Data: this.Data,
//ContractCreator: this.ContractCreator,
//ContractCreationTxHash: this.ContractCreationTxHash,

const analyzeTx = ({ 
  value,
  creationTimestamp,
  callsCount,
  isAVerifiedContract
}) => {
  insights = {score: undefined}
  let totalChecks = 4
  let score = totalChecks

  insights.verified = (isAVerifiedContract) ? "Contract verified!" : () => {
    score--
    return "[WARNING] Contract is NOT verified. Deployer might want to hide malicious functions"
  }

  let native_value = Number(value)
  if (native_value > 0) {
    score--
    insights.value = `[Warning] Value not null! Transfer ${native_value * 10**(-18)} eth`
  }

  let creationTime = new Date(creationTimestamp * 1000)
  let elapsedDays = ((new Date()).getTime() - creationTime.getTime()) / (1000*60*60*24)
  insights.date = `Contract was deployed on ${creationTime.toString()}.` 
  if (elapsedDays < 30) {
    score--
    insights.date += "\n[WARNING] Deployed less than a month ago."
  }

  if (callsCount > 7000) {
    insights.calls = ">7K calls. This contract is used a lot!"
  } else if (callsCount < 50) {
    score--
    insights.calls = `[WARNING] There were only ${callsCount} calls to this contract. This contract is not used a lot.`
  } else {
    insights.calls = `There were ${callsCount} calls to this contract.`
  }

  insights.score = `[${score}/${totalChecks}]`
  let ratio = score / totalChecks
  if (ratio == 1) {
    insights.score += " => SAFE"
  } else if (ratio > 0.5) {
    insights.score += " => OK (Check warnings)"
  } else {
    insights.score += " => RISKY (Check warnings and be cautious)"
  }

  return insights
}

module.exports = {
  analyzeTx
}
