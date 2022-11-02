const fs = require('fs');
const { spawnSync } = require('node:child_process');
const { addToIPFS } = require('./ipfs');
const logger = require('../utils/logger');

const bacalhauImage = "quintenbons/safecheckbacalhau:1.0";

const computeWithBacalhau = async (address, content) => {
  content.reverse()

  // Push to IPFS
  logger.info("Sending content on IPFS");
  const cid = await addToIPFS(content, `${address}.json`);

  // Launch bachalau
  logger.info("Running job on baclhau", bacalhauImage, cid);
  const result = spawnSync('bacalhau', ['docker', 'run', '--id-only', bacalhauImage, '--inputs', cid]);
  let jobId = result.stdout.toString();
  jobId = /^[^\n]*/.exec(jobId)[0];

  // Get output locally
  logger.info("Getting bacalhau output locally", bacalhauImage, cid);
  const result1 = spawnSync('bacalhau', ['get', '--output-dir', './computed', jobId]);

  // TODO: Return information... Unless execution went wrong
  logger.info("DONE", bacalhauImage, cid);
}

const computeLocally = async (address, content) => {
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
  computeWithBacalhau,
  computeLocally,
};