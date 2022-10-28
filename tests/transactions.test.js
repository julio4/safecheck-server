const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('API is working', () => {
  beforeEach(async () => {
    console.log("Before each test")
  })

  test('API say hello', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})
