const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  bio: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  posts: [
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
      },
    },
  ],
})

module.exports = User = mongoose.model('user', UserSchema)
