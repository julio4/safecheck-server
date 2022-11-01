const ValidationError = require('../errors/validationError')
const ContractDataCollector = require('./contractDataCollector')

const { simulateTx } = require('../services/simulate')

module.exports = class TxDataCollector {
  constructor(body) {
    const needed = ["from", "to"]
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
    // we assume transaction is to a smart contract
    // fetch data about contract
    
    this.contractDataCollector = new ContractDataCollector(this.contractAddr)

    await this.contractDataCollector.populateData()

    // simulate tx
    const { status, simulation } = await simulateTx(this.toTx())
  }

  toTx() {
    return {
      from: this.from,
      to: this.contractAddr,
      value: this.value,
      gas: this.gas,
      maxFeePerGas: this.maxFeePerGas,
      maxPriorityFeePerGas: this.maxPriorityFeePerGas,
      data: this.data
    }
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
      ...this.contractDataCollector.toJSON()
    }
  }
}
