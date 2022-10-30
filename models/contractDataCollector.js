const { getContractData, getContractCallsCount, getIfItsVerified } = require('../services/eth_requests')
const logger = require('../utils/logger')

module.exports = class ContractDataCollector {

  constructor(address) {
    this.address = address
  }

  async populateData() {
    const p1 = getIfItsVerified(this.address)
      .then(data => {
        this.isAVerifiedContract = data
      })

    // join this to next call, to have a single call to transpose api
    const count = await getContractCallsCount(this.address)
    this.callsCount = count 

    const contractData = await getContractData(this.address)
    this.contractCreator = contractData.creator_address
    this.creationTimestamp = contractData.created_timestamp
    this.lastActiveTimestamp = contractData.last_active_timestamp

    return p1
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
