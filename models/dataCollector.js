const { getContractCreationData, getContractCalls, getIfItsVerified } = require('../services/eth_requests')

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
      this.ContractCall30Days = data.result.length
    })

    const p3 = getIfItsVerified(this.ContractAddr).then(data => {
      this.IsAVerifiedContract = data
    })

    return Promise.all([p1, p2, p3])
  }

  toJSON() {
    return {
      from: this.From,
      contractAddr: this.ContractAddr,
      value: this.Value,
      gas: this.Gas,
      maxFeePerGas: this.MaxFeePerGas,
      maxPriorityFeePerGas: this.MaxPriorityFeePerGas,
      data: this.Data,
      contractCreator: this.ContractCreator,
      contractCreationTxHash: this.ContractCreationTxHash,
      creationTimestamp: this.CreationTimestamp,
      contractCall30Days: this.ContractCall30Days,
      isAVerifiedContract: this.IsAVerifiedContract
    }
  }
}
