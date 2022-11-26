require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
const { mongo } = require('mongoose')
const { prependOnceListener } = require('./models/persons')
const { json } = require('express')

const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body);
});

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use((morgan(':method :url :status :res[content-length] - :response-time ms :body')))



app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => (
        response.json(result)
    )).catch((error) => next(error))
})

app.get('/info', (request, response) => {
    Person.countDocuments().then(result => {
        response.send(`<h4> There are ${result} people in phonebook. </h4> <br> ${new Date()}`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(result => (
        result? response.json(result) : response.status(404).end()
    )).catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {return response.status(204).end()
    }).catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const person = request.body
    // response.send(person.name)
    // response.send(person.number)
    if (!person){
        return response.status(404).json({error: 'Missing data'})
    }
    Person.countDocuments({name: person.name}).then((count)=> {
        if (count>0) {
            return response.status(400).send({ error: 'name already exists' }) 
        }
    })
    const newPerson = new Person(
        {name: person.name, 
         number: person.number
    })
    newPerson.save().then(result => response.json(result)).catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = request.body
    const id = request.params.id
    // response.send(person.name)
    // response.send(person.number)
    if (!person){
        return response.status(404).json({error: 'Missing data'})
    }
    Person.findByIdAndUpdate(id, {number: person.number}, {new: true, runValidators: true, context: "query"}).then(result => response.json(result)).catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }  if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }
      next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
