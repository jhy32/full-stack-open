const config = require('../utils/config')
const blogRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//       return authorization.substring(7)
//     }
//     return null
//   }
  

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {name:1, username:1})
    response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})
  
blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const blog = new Blog(request.body)
    if (!blog.likes) {
        blog.likes = 0
    }
    if (!blog.url || !blog.title) {
        return response.status(400).end()
    }
    //random attaching of user
    // const userCount = await User.count()
    // var random = Math.floor(Math.random() * userCount)
    // const user = await User.findOne().skip(random)
    blog.user = request.user
    const savedBlog = await blog.save()

    const user = await User.findById(request.user)
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    response.status(201).json(savedBlog)

  })

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try{
        const blogToDelete = await Blog.findById(request.params.id)
        if (request.user.toString() === blogToDelete.user.toString()) { 
            await Blog.findByIdAndRemove(request.params.id)
            return response.status(204).end()
        } return response.status(401).json({error: "wrong user"})
    } catch(exception) {
        next(exception)
    }
})

blogRouter.put('/:id', async (request, response) => {
    try{
        const newBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true})
        return response.status(200).json(newBlog)
    } catch(exception) {
        next(exception)
    }
})



module.exports = blogRouter