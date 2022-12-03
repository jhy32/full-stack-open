const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/User')

beforeEach(async() => {
    await User.deleteMany({})
    const users = [new User({name: 'Alice Walker', username: 'alice', password: 'walker'}),
                   new User({name: 'Shawn Mendes', username: 'smendes', password: 'camilla'})]
    await Promise.all(users.map(user => user.save()))
}, 1000000)

describe('invalid data is rejected', () => {
    test('password too short', async() => {
        const user = {name: 'John Nash', username: 'jonn', password: 'ab' }
        await api.post('/api/users')
                 .send(user)
                 .expect(400)
        const reply = await api.get('/api/users')
        expect(reply.body).toHaveLength(2)
        expect(reply.body.map(r => r.username)).not.toContain('jonn')
    }, 100000)
    test('username too short', async() => {
        const user = {name: 'Mary Nee', username: 'mn', password: 'abcdefg' }
        await api.post('/api/users')
                 .send(user)
                 .expect(400)
        const reply = await api.get('/api/users')
        expect(reply.body).toHaveLength(2)
        expect(reply.body.map(r => r.username)).not.toContain('mn')
    }, 100000)
    test('username not unique', async() => {
        const user = {name: 'Alice Johanns', username: 'alice', password: 'abcdefg' }
        await api.post('/api/users')
                 .send(user)
                 .expect(400)
        const reply = await api.get('/api/users')
        expect(reply.body).toHaveLength(2)
        expect(reply.body.map(r => r.name)).not.toContain('Alice Johanns')
    }, 100000)
    test('valid input is posted', async() => {
        const user = {name: 'Calcium Scott', username: 'calcium', password: 'abcdefg' }
        await api.post('/api/users')
                 .send(user)
                 .expect(200)
        const reply = await api.get('/api/users')
        expect(reply.body).toHaveLength(3)
        expect(reply.body.map(r => r.username)).toContain('calcium')
    }, 100000)
})

afterAll(() => {
    mongoose.connection.close()
})