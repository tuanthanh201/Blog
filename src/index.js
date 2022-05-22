const connectToDB = require('./db/mongoose')
const setupApolloServer = require('./apolloServer')

const startServer = async () => {
  connectToDB()
  await setupApolloServer()
}

startServer()
