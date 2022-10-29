const { getContractData, getContractCalls, getIfItsVerified } = require('../services/eth_requests')
const ValidationError = require('./ValidationError')

module.exports = class ContractDataCollector {
  constructor(body) {
    const needed = ["address"]
    needed.forEach(property => {
      if (!body.hasOwnProperty(property))
        throw new ValidationError(`Invalid contract input for property ${property}`)
    })

    this.address = body.address
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
      address: this.address,
      contractCreator: this.contractCreator,
      creationTimestamp: this.creationTimestamp,
      lastActiveTimestamp: this.lastActiveTimestamp,
      isAVerifiedContract: this.isAVerifiedContract,
      callsCount: this.callsCount
    }
  }
}
