const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Image = mongoose.model('image', ImageSchema)
