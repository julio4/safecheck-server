# SafeCheck Server

Express.js app to provide insights about transactions data and smart contracts on ethereum.

---

## Endpoint

### /api/v1/tx

method: `POST`

| Value         | Type          | Required  |
| ------------- |:-------------:| ---------:|
| from          | address       |     *     |
| to            | address       |     *     |
| ...           | ...           |           |


### /api/v1/contract/:address

method: `GET`

| Value         | Type          | Required  |
| ------------- |:-------------:| ---------:|
| address       | address       |     *     |

WIP
