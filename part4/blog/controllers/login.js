const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')

loginRouter.post('/', async(request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({username: username})

  const isCorrectPassword = user === null 
    ? false 
    : await bcrypt.compare(password, user.hashedPassword)

  if(!(isCorrectPassword && user)){
    return response.status(401).json({error: 'invalid username or password'})
  }

  const token = jwt.sign({user: user.username, id: user._id}, process.env.SECRET, {expiresIn: 60*60})

  response.json({name: user.name, username: user.username, token})
})

module.exports = loginRouter