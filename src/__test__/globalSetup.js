const connectToDb = require('../db/mongoose')
const setupApolloServer = require('../apolloServer')

module.exports = async () =>
  (async () => {
    global.mongoose = await connectToDb()
    global.apolloServer = await setupApolloServer()
  })()
