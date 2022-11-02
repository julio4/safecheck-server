const fs = require('fs');
const { Web3Storage, File } = require('web3.storage');
const { WEB3STORAGE_API_KEY } = require('../utils/config')

const addToIPFS = async (data, filename) => {
  const client = new Web3Storage({ token: WEB3STORAGE_API_KEY });
  const file = new File([JSON.stringify(data)], `${filename}.json`, { type: 'application/json' })

  const cid = await client.put([file], {
    wrapWithDirectory: true
  })

  return cid
}

module.exports = {
  addToIPFS,
}