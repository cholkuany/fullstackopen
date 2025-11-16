const blogsRouter = require('express').Router()

const logger = require('../utils/logger')
const Blog = require('../models/blogs')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async(request, response) => {
  const id =  request.params.id
  const blog = await Blog.findById(id)
  response.json(blog)
})

blogsRouter.delete('/:id', async(request, response) => {
  const blogId = request.params.id

  const user = request.user
  const blog = await Blog.findById(blogId)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!user) {
    return response.status(401).json({ error: 'unauthorized user' })
  }

  if(user._id.toString() === blog.user.toString()){
    const deletedBlog = await Blog.findByIdAndDelete(blogId)
    if(deletedBlog){
      user.blogs = user.blogs.filter(blogId => {
        return blogId.toString() !== deletedBlog._id.toString()
      })
      await user.save()
    }
    return response.status(204).end()
  }

  return response.status(401).json({error: 'unauthorized request'})
})

blogsRouter.put('/:id', async(request, response) => {
  const id = request.params.id
  const { likes } = request.body
  const blog = await Blog.findById(id)

  blog.likes = likes
  const updatedNote = await blog.save()
  response.json(updatedNote)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if(!user){
    return response.status(400).json({error: 'invalid user'})
  }

  const blog = new Blog({...body, user: user._id})

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

module.exports = blogsRouter