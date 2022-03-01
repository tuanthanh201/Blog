const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Post = mongoose.model('post', PostSchema)
