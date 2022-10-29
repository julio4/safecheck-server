const { getContractData, getContractCalls, getIfItsVerified } = require('../services/eth_requests')

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

    this.from = body.from
    this.contractAddr = body.to
    this.value = body.value
    this.gas = body.gas
    this.maxFeePerGas = body.maxFeePerGas
    this.maxPriorityFeePerGas = body.maxPriorityFeePerGas
    this.data = body.data
  }

  async populateData() {
    const p1 = getContractData(this.contractAddr).then(data => {
      this.contractCreator = data.contractCreator
      this.creationTimestamp = data.created_timestamp
      this.lastActiveTimestamp = data.last_active_timestamp
    })

    const p2 = getContractCalls(this.contractAddr).then(data => {
      this.callsCount = data.length
    })

    const p3 = getIfItsVerified(this.ContractAddr).then(data => {
      this.isAVerifiedContract = data
    })

    return Promise.all([p1, p2, p3])
  }

  toJSON() {
    return {
      from: this.from,
      contractAddr: this.contractAddr,
      value: this.value,
      gas: this.gas,
      maxFeePerGas: this.maxFeePerGas,
      maxPriorityFeePerGas: this.maxPriorityFeePerGas,
      data: this.data,
      contractCreator: this.contractCreator,
      creationTimestamp: this.creationTimestamp,
      lastActiveTimestamp: this.lastActiveTimestamp,
      isAVerifiedContract: this.isAVerifiedContract,
      callsCount: this.callsCount
    }
  }
}
