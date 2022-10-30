const fs = require('fs');
const { spawnSync } = require('node:child_process');
const { getFromIPFS } = require('./ipfs');

const getContractInfo = async (address) => {
  try {
    const content = JSON.parse(fs.readFileSync('./computed/contracts.json'));
    return (content[address] !== undefined) ? content[address] : null;
  } catch (err) {
    console.error("Could not read content from computed", err);
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

const callBacalhau = async (address, cid) => {
  // Launch bachalau
  const image = "quintenbons/testlisbon:1.7";
  console.log(image, cid);
  const result = spawnSync('bacalhau', ['docker', 'run', '--id-only', image, '--inputs', cid]);
  let jobId = result.stdout.toString();
  jobId = /^[^\n]*/.exec(jobId)[0];
  console.log("Bacalhau run done", jobId);

  // Write in cache
  const result1 = spawnSync('bacalhau', ['get', '--output-dir', './computed', jobId]);
  console.log("Bacalhau get done");

  let contracts = JSON.parse(fs.readFileSync('./computed/contracts.json'));
  contracts[address] = {cid, jobId};
  fs.writeFileSync('./computed/contracts.json', JSON.stringify(contracts));
}

const localBac = async (address, content) => {
  let result = { contractAdress: address, addressCallCount: {}, oldestTimeStamp: 0, newestTimeStamp: 0, timePlot: [], transactionOverTime: [], valueOverTime: [] };

  content.reverse()

  try {
      if (content.length === 0) {
          return result;
      }

      // Plot data
      result.oldestTimeStamp = new Date(content[0].timestamp).getTime();
      result.newestTimeStamp = new Date(content[content.length - 1].timestamp).getTime();
      const sturges = 1 + Math.floor(Math.log2(content.length));
      const step = Math.floor((result.newestTimeStamp - result.oldestTimeStamp) / sturges);

      let blockStart = result.oldestTimeStamp;
      let blockCount = 0;
      let blockValue = 0;
      let nextStep = result.oldestTimeStamp + step;

      for (let transaction of content) {
          if (result.addressCallCount[transaction.from_address] === undefined)
              result.addressCallCount[transaction.from_address] = 0;
          result.addressCallCount[transaction.from_address]++;

          // Pass to next block
          const transactionTime = new Date(transaction.timestamp).getTime();
          while (transactionTime > nextStep) {
              result.timePlot.push(blockStart);
              result.transactionOverTime.push(blockCount);
              result.valueOverTime.push(blockValue);

              blockStart = nextStep;
              blockCount = 0;
              blockValue = 0;

              nextStep = blockStart + step;
          }

          blockCount++;
          blockValue += transaction.value;
      }

  } catch (err) {
      console.error(err);
      return result;
  }

  return result;
}

module.exports = {
  getContractInfo,
  isComputed,
  callBacalhau,
  localBac,
};
