const jwt = require('jsonwebtoken')
const User = require('../models/users')
const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  console.log("error===>", error.message)
  if (error.name === "ValidationError"){
    return response.status(400).json({error: error.message})
  } else if(error.name === "JsonWebTokenError"){
    return response.status(401).json({error: 'invalid token'})
  }else if(error.name === 'TokenExpiredError'){
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const getToken = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')){
    const formattedAuthorization = authorization.replace('Bearer ', '')
    request.token = formattedAuthorization
  }else{
    request.token = null
  }
  next()
}

const getUser = async (request, response, next) => {
  let decodedToken
  if(request.token){
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  }
  if(!decodedToken){
    request.user = null
  }else {
    const user = await User.findById(decodedToken.id)
    user !== null 
      ? request.user = user
      : request.user = null
  }

  next()
}

module.exports = { errorHandler, getToken, getUser }