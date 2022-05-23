const connectToDB = require('../db/mongoose')
const setupApolloServer = require('../apolloServer')

module.exports = async () =>
  (async () => {
    global.mongoose = connectToDB()
    global.apolloServer = await setupApolloServer()
  })()
