if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// morgan logging
morgan.token('request-body', (req, res) => JSON.stringify(req.body))
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :request-body')
)

// get base server route
app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
})

// get api info
app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        response.send(
            `
            <div>
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            </div>
            `
        )
    })
})

// get all persons
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

// get person by id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// add person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

// update person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { runValidators: true, new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// delete person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// handle unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// handle errors
const errorHandler = (error, request, response, next) => {
    console.error(`${error.name} | ${error.message}`)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})