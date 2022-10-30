const fs = require('fs');

const getContractInfo = async (address) => {
  try {
    const content = JSON.parse(fs.readFileSync('../computed/contracts.json'));
    return (content[address] !== undefined) ? content[address] : null;
  } catch (err) {
    console.error("Could not read content from computed")
  }
}

const isComputed = async (address) => {
  try {
    const content = JSON.parse(fs.readFileSync('../computed/contracts.json'));
    return content[address] !== undefined;
  } catch (err) {
    console.error("Could not read content from computed")
  }
}

const callBacalhau = async (cid) => {

}

module.exports = {
  getContractInfo,
  isComputed,
  callBacalhau
};