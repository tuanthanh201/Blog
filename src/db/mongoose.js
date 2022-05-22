const mongoose = require('mongoose')

const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('Connected to MongoDb')
    })
    .catch(() => {
      // console.log('Failed to connect to MongoDB')
    })
  return mongoose
}

module.exports = connectToDB
