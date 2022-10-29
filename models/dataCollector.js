const { getContractCreationData, getContractCalls } = require('../services/eth_requests')

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = "ValidationError";
  }
}

module.exports = class DataCollector {
  constructor(body) {
    const needed = ["from", "to", "value", "gas", "maxFeePerGas", "maxPriorityFeePerGas", "data"]
    needed.forEach(property => {
      if (!body.hasOwnProperty(property))
        throw new ValidationError(`Invalid transaction input for property ${property}`)
    })

    this.From = body.from
    this.ContractAddr = body.to
    this.Value = body.value
    this.Gas = body.gas
    this.MaxFeePerGas = body.maxFeePerGas
    this.MaxPriorityFeePerGas = body.maxPriorityFeePerGas
    this.Data = body.data
  }

  async populateData() {
    const p1 = getContractCreationData(this.ContractAddr).then(data => {
      this.ContractCreator = data.contractCreator
      this.ContractCreationTxHash = data.contractCreationHash
      this.CreationTimestamp = data.creationTimestamp
    })

    const p2 = getContractCalls(this.ContractAddr).then(data => {
      this.ContractCallAllTime = data.result.length
    })

    return Promise.all([p1, p2])
  }

  toJSON() {
    return {
      From: this.From,
      ContractAddr: this.ContractAddr,
      Value: this.Value,
      Gas: this.Gas,
      MaxFeePerGas: this.MaxFeePerGas,
      MaxPriorityFeePerGas: this.MaxPriorityFeePerGas,
      Data: this.Data,
      ContractCreator: this.ContractCreator,
      ContractCreationTxHash: this.ContractCreationTxHash,
      CreationTimestamp: this.CreationTimestamp,
      ContractCallAllTime: this.ContractCallAllTime
    }
  }

  toInsightsJSON() {
    return this.toJSON()
  }
}
