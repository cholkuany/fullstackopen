const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true,
    minLength: 3
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set("toJSON", {
  transform: (document, returnedUser) => {
    returnedUser.id = returnedUser._id.toString(),
    delete returnedUser.__v
    delete returnedUser._id
    delete returnedUser.hashedPassword
  }
})

const User = mongoose.model("User", userSchema)

module.exports = User