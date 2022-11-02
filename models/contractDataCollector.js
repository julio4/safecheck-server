const { computeWithBacalhau, computeLocally } = require('../services/contractData')
const { getContractData, getContractCalls } = require('../services/eth_requests')
const { BACALHAU } = require('../utils/config')

module.exports = class ContractDataCollector {
  constructor(address) {
    this.address = address
  }

  async populateData() {
    const contractData = await getContractData(this.address)
    this.contractCreator = contractData.creator_address
    this.creationTimestamp = contractData.created_timestamp

    const content = await getContractCalls(this.address)

    let data;
    if (BACALHAU === "ENABLED") {
      data = await computeWithBacalhau(this.address, content);
    } else {
      data = await computeLocally(this.address, content);
    }

    this.computation = data
  }

  toJSON() {
    return {
      contractAddr: this.address,
      contractCreator: this.contractCreator,
      creationTimestamp: this.creationTimestamp,
      oldestTimeStamp: this.computation.oldestTimeStamp,
      newestTimeStamp: this.computation.newestTimeStamp,
      addressCallCount: this.computation.addressCallCount,
      timePlot: this.computation.timePlot,
      transactionOverTime: this.computation.transactionOverTime,
      valueOverTime: this.computation.valueOverTime,
    }
  }
}
