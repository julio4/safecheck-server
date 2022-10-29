# SafeCheck Server

Express.js app to provide insights about transactions data and smart contracts on ethereum.

---

## Endpoint

### /api/v1/tx

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


### /api/v1/contract/:address

method: `GET`

| Value         | Type          | Required  |
| ------------- |:-------------:| ---------:|
| address       | address       |     *     |


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

## Technicals details

WIP
