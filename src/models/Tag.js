const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TagSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Tag = mongoose.model('tag', TagSchema)
