module.exports = async () =>
  (async () => {
    await global.mongoose.connection.close()
    await global.apolloServer.close()
  })()
