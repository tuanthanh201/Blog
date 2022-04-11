const mongoose = require('mongoose')

const Image = require('../models/Image')
const Post = require('../models/Post')
const Tag = require('../models/Tag')
const User = require('../models/User')

const imageData = require('./seedData/images')
const postData = require('./seedData/posts')
const tagData = require('./seedData/tags')
const userData = require('./seedData/users')

const MONGO_CONNECTION_STRING = '<CONNECTION STRING>'

mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(async () => {
    try {
      console.log('Dropping existing database ...')
      await mongoose.connection.db.dropDatabase()

      console.log('Inserting user data...')
      await User.insertMany(userData)

      console.log('Inserting post data...')
      await Post.insertMany(postData)

      console.log('Inserting tag data...')
      await Tag.insertMany(tagData)

      console.log('Inserting image data...')
      await Image.insertMany(imageData)

      await mongoose.connection.close()
    } catch (error) {
      console.error(error)
    }
  })
  .catch(() => {
    console.log('Failed to connect to MongoDB')
  })
