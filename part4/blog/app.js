const express = require('express')
const app = express()
const mongoose = require('mongoose')

const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogsRouter')

  logger.info(`connecting to ${process.env.MONGODB_URI}`)
  mongoose.connect(config.MONGODB_URI).then(() => {
    logger.info('connected to MongoDB')
  }).catch((error) => {
    logger.error(`error connecting to MongoDB: ${error}`)
  })

app.use(express.json())
app.use('/api/blogs/', blogsRouter)

module.exports = app