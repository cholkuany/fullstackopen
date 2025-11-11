const {test, describe, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blogs')
const helper = require('./test_helper')

const app = require('../app')
const api = supertest(app)

beforeEach(async() => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('blog api test', () => {
  test('get all blogs', async() => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier named id', async() => {
    const blogs = await helper.blogsInDB()
    const blogToViewId = blogs[0].id

    const retrievedBlog = await api
      .get(`/api/blogs/${blogToViewId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogToViewId, retrievedBlog.body.id)
  })

  test('a valid blog can be created', async() => {
    const newBlog = {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtTheEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtTheEnd.length, helper.initialBlogs.length + 1)

  })

  test('a missing like default to zero', async() => {
      const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        __v: 0
      }
    const blog = await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
    assert.strictEqual(blog.body.likes, 0)
  })

  test('400 for missing title or url', async() => {
      const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        likes: 6,
        __v: 0
      }

      await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('delete a blog', async() => {
    const blogs = await helper.blogsInDB()
    const blogToDelete = blogs[0].id
    
    await api.delete(`/api/blogs/${blogToDelete}`).expect(204)
  })

  test('increment like', async() => {
    const blogs = await helper.blogsInDB()
    const {likes, id} = blogs[0]

    const blog = await api
      .put(`/api/blogs/${id}`)
      .send({likes: likes + 1})
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    assert.strictEqual(likes + 1, blog.body.likes)
  })
})

after(async() => {
  await mongoose.connection.close()
})

