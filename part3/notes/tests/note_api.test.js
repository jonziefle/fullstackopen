const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')
const User = require('../models/user')

describe('testing users api', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({
            username: 'root',
            name: 'user',
            passwordHash
        })

        await user.save()
    })

    describe('when there is initially one user in db', () => {
        test('creation succeeds with a fresh username', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'jimriggins',
                name: 'Jim Riggins',
                password: 'salamander'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

            const usernames = usersAtEnd.map(u => u.username)
            expect(usernames).toContain(newUser.username)
        })

        test('creation fails with proper statuscode and message if username already taken', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                name: 'Superuser',
                password: 'secret'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('`username` to be unique')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
    })
})

describe('testing login api', () => {
    beforeAll(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({
            username: 'root',
            name: 'user',
            passwordHash
        })

        await user.save()
    })

    describe('logging in a user', () => {
        test('user login information recieved with valid credentials', async () => {
            const loginInfo = {
                username: 'root',
                password: 'password',
            }

            const result = await api
                .post('/api/login')
                .send(loginInfo)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(result.body).toHaveProperty('token')
        })

        test('user login information recieved with valid credentials', async () => {
            const loginInfo = {
                username: 'root',
                password: 'wrong-password',
            }

            const result = await api
                .post('/api/login')
                .send(loginInfo)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('Invalid username or password')
        })
    })
})

describe('testing notes api', () => {
    beforeEach(async () => {
        await Note.deleteMany({})
        const noteObjects = helper.initialNotes.map(note => new Note(note))
        const promiseArray = noteObjects.map(note => note.save())
        await Promise.all(promiseArray)
    })

    describe('when there are initially some notes saved', () => {
        test('notes are returned as json', async () => {
            await api
                .get('/api/notes')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        }, 100000)

        test('all notes are returned', async () => {
            const response = await api.get('/api/notes')
            expect(response.body).toHaveLength(helper.initialNotes.length)
        })

        test('a specific note is within the returned notes', async () => {
            const response = await api.get('/api/notes')
            const contents = response.body.map(r => r.content)
            expect(contents).toContain(
                'Browser can execute only Javascript'
            )
        })
    })

    describe('viewing a specific note', () => {
        test('succeeds with a valid id', async () => {
            const notesAtStart = await helper.notesInDb()
            const noteToView = notesAtStart[0]

            const resultNote = await api
                .get(`/api/notes/${noteToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
            expect(resultNote.body).toEqual(processedNoteToView)
        })

        test('fails with statuscode 404 if note does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/notes/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/notes/${invalidId}`)
                .expect(400)
        })
    })

    describe('addition of a new note', () => {
        let loginCredentials = {}
        beforeAll(async () => {
            const loginInfo = {
                username: 'root',
                password: 'password',
            }

            const result = await api
                .post('/api/login')
                .send(loginInfo)

            loginCredentials = result.body
        })

        test('succeeds with valid data', async () => {
            const newNote = {
                content: 'async/await simplifies making async calls',
                important: true,
            }

            await api
                .post('/api/notes')
                .set('Authorization', 'bearer ' + loginCredentials.token)
                .send(newNote)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const notesAtEnd = await helper.notesInDb()
            expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

            const contents = notesAtEnd.map(n => n.content)
            expect(contents).toContain('async/await simplifies making async calls')
        })

        test('fails with status code 401 if user invalid', async () => {
            const newNote = {
                content: 'async/await simplifies making async calls',
                important: true,
            }

            await api
                .post('/api/notes')
                .send(newNote)
                .expect(401)

            const notesAtEnd = await helper.notesInDb()
            expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
        })

        test('fails with status code 400 if data invalid', async () => {
            const newNote = {
                important: true
            }

            await api
                .post('/api/notes')
                .set('Authorization', 'bearer ' + loginCredentials.token)
                .send(newNote)
                .expect(400)

            const notesAtEnd = await helper.notesInDb()
            expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
        })
    })

    describe('deletion of a note', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const notesAtStart = await helper.notesInDb()
            const noteToDelete = notesAtStart[0]

            await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .expect(204)

            const notesAtEnd = await helper.notesInDb()
            expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

            const contents = notesAtEnd.map(r => r.content)
            expect(contents).not.toContain(noteToDelete.content)
        })
    })
})



afterAll(() => {
    mongoose.connection.close()
})