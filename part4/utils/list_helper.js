const lodash = require('lodash')
const dummy = (blogs) => {
    return 1
  }



const totalLikes = (blogs) => { 
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const likeArray = blogs.map((blog) => blog.likes)
    const max = Math.max(...likeArray)
    return blogs[likeArray.indexOf(max)]
}

const mostBlogs = (blogs) => {
    const arr = lodash.maxBy(lodash.entries(lodash.countBy(blogs, blog => blog.author)), lodash.last)
    return {'author': arr[0], 'blogs': arr[1]}
     
}


  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog, 
    mostBlogs
}