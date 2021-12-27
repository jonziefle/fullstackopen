const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// morgan logging
morgan.token('request-body', (req, res) => JSON.stringify(req.body))
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :request-body')
)

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

// get base server route
app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
})

// get api info
app.get('/info', (request, response) => {
    response.send(
        `
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>
        `
    )
})

// get all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// get person by id
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// add person
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
  
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// delete person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})