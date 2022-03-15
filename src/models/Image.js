const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Image = mongoose.model('image', ImageSchema)
