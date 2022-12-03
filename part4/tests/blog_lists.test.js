const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

const initialLength = 4
beforeEach(async () => {

  
    // let noteObject = new Note(helper.initialNotes[0])
    // await noteObject.save()
  
    // noteObject = new Note(helper.initialNotes[1])
    // await noteObject.save()
    // jest.setTimeout(async() => {
        await Blog.deleteMany({})
        for (let blog of testHelper.blogs.slice(0, initialLength)) {
              let blogObject = new Blog(blog)
              await blogObject.save()
        }
        // const blogs = testHelper.blogs.slice(0, initialLength).map(blog => new Blog(blog))
        // await Promise.all(blogs.map(blog => blog.save()))
        // }, 100000)
    
}, 100000) 

describe('test get requests', () => {
    test('are JSON', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 100000)
    test('return all blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialLength)
    }, 100000)
    test('contains a specific blog', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.url)
        const testBlogNum = initialLength - 1
        expect(contents).toContain(
          testHelper.blogs[testBlogNum].url
        )
    }, 100000)
})

test('ID property named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})  

describe('post request', () => {
    test('succeeds with valid data', async () => {
        const newBlog = testHelper.blogs[initialLength]
        await api.post('/api/blogs')
                 .send(newBlog)
                 .expect(201)
                 .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialLength + 1)
        expect(response.body.map(r => r.url)).toContain(newBlog.url)
    })

    test('likes default to 0', async () => {
        const newBlog = {...(testHelper.blogs[4])}
        delete newBlog.likes
        await api.post('/api/blogs')
                 .send(newBlog)
        const response = await api.get('/api/blogs')
        const savedBlog = response.body.find(r => r.url === newBlog.url)
        expect(savedBlog.likes).toBeDefined()
        expect(savedBlog.likes).toBe(0)
    })

    test('missing title or url causes bad request', async () => {
        let newBlog = {...(testHelper.blogs[4])}
        delete newBlog.title
        await api.post('/api/blogs')
                 .send(newBlog)
                 .expect(400)
        let response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialLength)
        expect(response.body.map(r => r.url)).not.toContain(newBlog.url)
        
        newBlog = {...(testHelper.blogs[4])}
        delete newBlog.url
        await api.post('/api/blogs')
                .send(newBlog)
                .expect(400)
        response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialLength)
        expect(response.body.map(r => r.url)).not.toContain(newBlog.url)
    })
})

describe('delete request', () => {
    test('succeeds with valid data', async () => {
        const blogToDelete = testHelper.blogs[2]
        await api.delete(`/api/blogs/${blogToDelete._id}`)
                 .expect(204)
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialLength - 1)
        expect(response.body.map(r => r.id)).not.toContain(blogToDelete._id)
    })
})

describe('update request', () => {
    test.only('updates with valid data', async () => {
        const blogToUpdate = {...testHelper.blogs[2], likes: 1000000}
        await api.put(`/api/blogs/${blogToUpdate._id}`)
                 .send(blogToUpdate)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)
        let response = await api.get(`/api/blogs/${blogToUpdate._id}`)
        expect(response.body.url).toBe(blogToUpdate.url)
        expect(response.body.title).toBe(blogToUpdate.title)
        expect(response.body.likes).toBe(blogToUpdate.likes)
        response = await api.get(`/api/blogs`)
        expect(response.body).toHaveLength(initialLength)
    })
})



afterAll(() => {
    mongoose.connection.close()
})