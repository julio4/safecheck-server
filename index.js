/* eslint-disable no-undef */
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const fs = require('fs')

const server = http.createServer(app)

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

server.listen(config.PORT, () => {
  if (!fs.existsSync('./computed/'))
    fs.mkdirSync('./computed');
  if (!fs.existsSync('./computed/contracts.json'))
    fs.writeFileSync('./computed/contracts.json', JSON.stringify({}));

  logger.info(`Server running on port ${config.PORT}`)
})
