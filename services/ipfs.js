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

const getFromIPFS = async (cid) => {
  const outputsPath = `../computed/${cid}/outputs`;

  try {
    if (!fs.existsSync(outputsPath)) {
      const client = new Web3Storage({ token: WEB3STORAGE_API_KEY });
      const content = await client.get(cid)

      if (!content.ok) {
        console.error("IPFS client failed to get CID");
        return null;
      }

      const files = await content.files();
      for (const file of files) {
        console.log("FILES");
        console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
      }
    }
  } catch (err) {
    console.error("Could not add IPFS result to cache", err);
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
}

module.exports = {
  addToIPFS,
  getFromIPFS
}