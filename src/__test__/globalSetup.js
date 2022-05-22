const connectToDb = require('../db/mongoose')
const setupApolloServer = require('../apolloServer')

module.exports = async () =>
  (async () => {
    global.mongoose = connectToDb()
    global.apolloServer = await setupApolloServer()
  })()
