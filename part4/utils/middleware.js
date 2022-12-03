const logger = require("./logger")
const jwt = require("jsonwebtoken")
const config = require("./config")

const unknownEndpoint = (request, response) => {
    response.status(404).send({'error': 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } if (error.name === "JsonWebTokenError") {
      return response.status(401).json({ error: "unauthorized" })
    }
    next(error)
  }

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if ((authorization) && (authorization.toLowerCase().startsWith('bearer '))) {
        request.token = authorization.substring(7)
    } 
    next()
  }

const userExtractor = (request, response, next) => {
    request.user =  jwt.verify(request.token, config.SECRET).id
    next()
  }
  

module.exports = {
    unknownEndpoint, 
    errorHandler,
    requestLogger,
    tokenExtractor,
    userExtractor
}