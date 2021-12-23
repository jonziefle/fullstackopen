const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())

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

// generates random IDs
const generateId = () => {
    const min = 1
    const max = Math.pow(2,20)
    
    let id
    do {
        id = Math.floor(Math.random() * (max - min + 1) + min)
    } while (persons.some((person) => person.id === id))

    return id
}

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
    response.json(persons)
})

// get person by id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// add person
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'The name or number is missing.' })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ error: 'The name already exists.' })
    }
  
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
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