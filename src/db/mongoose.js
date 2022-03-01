const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const mongoose = require('mongoose')

const connectToDB = () => {
  return mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('Connected to MongoDb')
    })
    .catch(() => {
      console.log('Failed to connect to MongoDB')
    })
}

module.exports = connectToDB
