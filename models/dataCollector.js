const axios = require('axios')

const ETHERSCAN_API_KEY = "https://api.etherscan.io/api"
const Web3 = require('web3')
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_PROVIDER));

module.exports = class DataCollector {
    constructor(body) {
        this.From = body.from
        this.ContractAddr = body.to
        this.Value = body.value
        this.Gas = body.gas
        this.MaxFeePerGas = body.maxFeePerGas
        this.MaxPriorityFeePerGas = body.maxPriorityFeePerGas
        this.Data = body.data
    }

    // ETHERSCAN API
    async getContractCreator() {
        const promise = axios.get(ETHERSCAN_API_KEY, {
            params: {
                module: 'contract',
                action: 'getcontractcreation',
                contractaddresses: this.ContractAddr,
                apikey: process.env.ETHERSCAN_API_KEY
            }
        })
        promise.then((result) => {
            // console.log("Promise resolving in getContractCreator")
            if (result.data.status === "1") {
                this.ContractCreator = result.data.result[0].contractCreator
                this.ContractCreationTxHash = result.data.result[0].txHash
            }
        })

        return promise
    }

    // WEB3 JS x INFURA
    async getCreationDate(promise) {
        return new Promise((resolve, reject) => {
            // console.log("Awaiting for the promise to resolve in getCreationDate")
            promise.then(async () => {
                // console.log("Promise resolving in getCreationDate")
                // console.log("ContractCreationTxHash: " + this.ContractCreationTxHash)
                // Get the tx data (and the block hash)
                var creationTxData = await web3.eth.getTransaction(this.ContractCreationTxHash)
                // Get the block timestamp
                var blockDataPromise = web3.eth.getBlock(creationTxData.blockHash)
                blockDataPromise.then((blockData) => {
                    this.CreationTimestamp = blockData.timestamp
                })
                resolve(blockDataPromise)
            })
        })
    }

    // ETHERSCAN API
    async getAbi() {
        //
    }

    // ETHERSCAN API
    async getMediumGasPriceToday() {
        throw new Error("Premium functionality")
        // const now = Date.now()
        // const today = new Date(now)
        // const yesturday = new Date(now - 24 * 60 * 60 * 1000);
        // const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getFullYear()}`
        // const yesturdayDateString = `${yesturday.getFullYear()}-${yesturday.getMonth() + 1}-${yesturday.getFullYear()}`

        // const result = await axios.get(ETHERSCAN_API_KEY, {
        //     params: {
        //         module: 'stats',
        //         action: 'dailyavggasprice',
        //         startdate: yesturdayDateString,
        //         enddate: todayDateString,
        //         sort: 'asc',
        //         apikey: process.env.ETHERSCAN_API_KEY
        //     }
        // })
    }

    // ETHERSCAN API
    async getTxData() {
        const latest = await web3.eth.getBlockNumber()
        const averageBlockForOneMonth = parseInt(60 * 60 * 24 * 30 / 12)
        var promise = axios.get(ETHERSCAN_API_KEY, {
            params: {
                module: 'logs',
                action: 'getLogs',
                fromBlock: latest - averageBlockForOneMonth,
                toBlock: latest,
                page: "1",
                offset: "1000",
                address: this.ContractAddr,
                apikey: process.env.ETHERSCAN_API_KEY
            }
        })
        promise.then((result) => {
            console.log("Handle tx data here")
            // Handle tx data somewhere else
        })
        return promise
    }

    async populateData() {
        var contractCreatorPromise = this.getContractCreator()
        var creationDatePromise = this.getCreationDate(contractCreatorPromise)
        var txDataPromise = this.getTxData()

        await creationDatePromise.then((result) => {
            //console.log("Creation date promise resolved")
        })
        await txDataPromise.then((result) => {
            // Handle tx data somewhere elese
        })
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
}
