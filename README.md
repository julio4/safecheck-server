# SafeCheck Server

Express.js app to provide insights about transactions data and smart contracts on ethereum.

See https://github.com/julio4/safecheck-monorepo and https://github.com/julio4/bacalhau-ethereum-contracts

---

## Endpoint

### /api/v1/tx/

method: `POST`

| Value                 | Type          | Required  |
| --------------------- |:-------------:| ---------:|
| from                  | address       |     *     |
| to                    | address       |     *     |
| value                 | wei           |           |
| data                  | hex calldata  |           |
| gas                   | gas           |           |
| maxFeePerGas          | gas           |           |
| maxPriorityFeePerGas  | gas           |           |

Return:

| Value                 | Description                                                             |
| --------------------- |:-----------------------------------------------------------------------:|
| from                  | the caller address                                                      |
| to                    | the receiving smart contract address                                    |
| value                 | amount of ETH to transfer from sender to recipient                      |
| data                  | arbitrary data                                                          |
| gas                   | the maximum amount of gas units that can be consumed by the transaction |
| maxFeePerGas          | the maximum amount of gas willing to be paid for the transaction        |
| maxPriorityFeePerGas  | the maximum amount of gas to be included as a tip to the validator      |
| contract data of 'to' | see below for more information                                          |

### /api/v1/tx/wallet

For wallet integration

method: `POST`

| Value                 | Type          | Required  |
| --------------------- |:-------------:| ---------:|
| from                  | address       |     *     |
| to                    | address       |     *     |
| value                 | wei           |     *     |
| data                  | hex calldata  |     *     |
| gas                   | gas           |           |
| maxFeePerGas          | gas           |           |
| maxPriorityFeePerGas  | gas           |           |

Return:

Json insights and safety score.

### /api/v1/contract/:address

method: `GET`

| Value         | Type          | Required  |
| ------------- |:-------------:| ---------:|
| address       | address       |     *     |


Return:

| Value               | Description                                                             |
| ------------------- |:-----------------------------------------------------------------------:|
| address             | Adress of the contract                                                  |
| contractCreator     | Adress of the deployer                                                  |
| creationTimestamp   | Timestamp of deployment transaction                                     |
| lastActiveTimestamp | Timestamp of the last transaction sent by the contract                  |
| isAVerifiedContract | Boolean telling if the contract code is verified                        |
| callsCount          | Number of transaction calls to the contract (Descending order, max 10K) |

# Front-end repository
[SafeCheck Monorepo](https://github.com/julio4/safecheck-monorepo)
