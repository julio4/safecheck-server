const testingRouter = require('express').Router()

testingRouter.get('/', (request, response) => {
  response.json("not implemented");
})

module.exports = testingRouter
