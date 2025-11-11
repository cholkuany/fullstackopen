const blogsRouter = require('express').Router()

const logger = require('../utils/logger')
const Blog = require('../models/blogs')
const { response } = require('../app')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async(request, response) => {
  const id =  request.params.id
  const blog = await Blog.findById(id)
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog(body)

  if(body.title === undefined || body.url === undefined){
    return response.status(400).end()
  }

  const savedBlog = await blog.save()
  console.log(savedBlog)
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter