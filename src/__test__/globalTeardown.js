module.exports = async () =>
  (async () => {
    // console.log(global.mongoose.connection.close);
    await global.mongoose.connection.close()
    await global.apolloServer.close()
  })()
