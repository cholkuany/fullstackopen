const express = require('express')
const app = express()
const mongoose = require('mongoose')

const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogsRouter')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')


logger.info(`connecting to ${process.env.MONGODB_URI}`)
mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB')
}).catch((error) => {
  logger.error(`error connecting to MongoDB: ${error}`)
})

app.use(express.json())
app.use(middleware.getToken)
app.use('/api/blogs', middleware.getUser, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingResetRouter = require('./controllers/testingResetRouter')
  app.use('/api/testing', testingResetRouter)
}
app.use(middleware.errorHandler)

module.exports = app