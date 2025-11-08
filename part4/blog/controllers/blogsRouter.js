const blogsRouter = require('express').Router()

const logger = require('../utils/logger')
const Blog = require('../models/blogs')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response) => {
  const body = request.body
  logger.info(body)
  const blog = new Blog(body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter