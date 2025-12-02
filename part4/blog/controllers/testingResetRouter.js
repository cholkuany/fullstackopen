const User = require("../models/users");
const Blog = require("../models/blogs");

const testingResetRouter = require('express').Router()

testingResetRouter.post('/', async (request, response) => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  response.status(204).end()
})

module.exports = testingResetRouter