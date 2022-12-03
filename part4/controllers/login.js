const User = require('../models/user')
const config = require('../utils/config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

loginRouter.post('/', async(request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({username})
    if (user && bcrypt.compare(password, user.passwordHash)) {
       const userToken = {
        username: username,
        id: user._id
       }
       const signedToken = jwt.sign(userToken, config.SECRET)
       //send over the info of the user + signed-token of 
       response.status(200).send({signedToken, username: username, name: user.name})
    } else {
        response.status(401).json({error: "invalid username or password"})
    }
})


module.exports = loginRouter