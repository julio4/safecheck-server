const fs = require('fs');
const { Web3Storage, File } = require('web3.storage');
const { WEB3STORAGE_API_KEY } = require('../utils/config')

const addToIPFS = async (data, filename) => {
  const client = new Web3Storage({ token: WEB3STORAGE_API_KEY });
  const file = new File([JSON.stringify(data)], `${filename}.json`, { type: 'application/json' })

  const cid = await client.put([file], {
    wrapWithDirectory: false
  })

  const res = await client.get(cid)
  if (!res.ok) {
    throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
  }

  // unpack File objects from the response
  const files = await res.files()
  for (const file of files) {
    console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
  }

  return cid
}

const getFromIPFS = async (cid) => {
  const outputsPath = `../computed/${cid}/outputs`;

  try {
    if (!fs.existsSync(outputsPath)) {
      const client = new Web3Storage({ token: WEB3STORAGE_API_KEY });

      const content = await client.get(cid)

      if (!content.ok) {
        console.error("IPFS client failed to get CID");
      }
    }
  } catch (err) {
    console.error("Could not find cached CID", err);
    return null
  }

  try {
    const files = fs.readdirSync(outputsPath);
    const firstFilePath = `${outputsPath}/${files[0]}`;
    const content = JSON.parse(fs.readFileSync(firstFilePath));
    return content;
  } catch (err) {
    console.error("Could not find cached CID", err);
    return null
  }



  const res = await client.get(cid)
  if (!res.ok) {
    throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
  }

  // unpack File objects from the response
  const files = await res.files()
  for (const file of files) {
    console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
  }

  return cid
}

module.exports = {
  addToIPFS
}
