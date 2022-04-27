const connectToDB = require('./db/mongoose')
const setupApolloServer = require('./apolloServer')

const startServer = async () => {
  await connectToDB()
  await setupApolloServer()
}

startServer()
