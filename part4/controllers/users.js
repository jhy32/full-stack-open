const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    const {name, username, password } = request.body
    const doesDuplicateExist = await User.findOne({username: username})
    if (doesDuplicateExist){
        return response.status(400).json({"error": "username already exists"})
    } if(!password || password.length < 3) {
        return response.status(400).json({"error": "missing or invalid password"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({name, username, passwordHash})
    const savedUser = await user.save()
    response.status(200).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, url: 1, author:1, likes:1})
    response.json(users)
})



// loginRouter.post('/', async(request, response) {
//     const { username, password } = request.body
//     const user = await User.findOne({username})
//     if (user && bcrypt.compare(password, user.passwordHash) {
//        const userToken = {
//         username: username,
//         id: user.id
//        }
//        const signedToken = jwt.signToken(userToken, process.env.SECRET)
//        //send over the info of the user + signed-token of 
//        response.status(200).send({signedToken, username: username, name: user.name})
//     } else {
//         response.status(401).json({error: "invalid username or password"})
//     }
// })


module.exports = userRouter
