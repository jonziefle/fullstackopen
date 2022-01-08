const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

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

        test('creation fails if username is not unique', async () => {
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

        test('creation fails if username not provided', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                name: 'Superuser',
                password: 'secret'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('`username` is required')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })

        test('creation fails if username too short', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'ro',
                name: 'Superuser',
                password: 'secret'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('shorter than the minimum allowed length (3)')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })

        test('creation fails if password not provided', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                name: 'Superuser'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('password must be at least 3 characters long')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })

        test('creation fails if password too short', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                name: 'Superuser',
                password: 'se'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('password must be at least 3 characters long')

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

        test('error recieved with invalid credentials', async () => {
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

describe('testing blogs api', () => {
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

    beforeEach(async () => {
        await Blog.deleteMany({})
        const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })

    describe('when there are initially some blogs saved', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        }, 100000)

        test('all blogs are returned', async () => {
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })

        test('the unique identifier of the blog post is \'id\'', async () => {
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd[0].id).toBeDefined()
        })
    })

    describe('addition of a new blog', () => {
        test('a valid blog can be added', async () => {
            const newBlog = {
                title: 'Blogs: What are they good for?',
                author: 'Jim Riggins',
                url: 'https://www.blogsrus.com/jimriggins/blogs-what-are-they-good-for',
                likes: 13
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loginCredentials.token}`)
                .send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(n => n.title)
            expect(titles).toContain('Blogs: What are they good for?')
        })

        test('fails with status code 401 if user invalid', async () => {
            const newBlog = {
                title: 'Blogs: What are they good for?',
                author: 'Jim Riggins',
                url: 'https://www.blogsrus.com/jimriggins/blogs-what-are-they-good-for',
                likes: 13
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })

        test('if the \'likes\' property is missing, it will default to 0', async () => {
            const newBlog = {
                title: 'Trains, Planes, and Automobiles',
                author: 'Greg Williams',
                url: 'https://www.blogsrus.com/gregwilliams/trains-planes-and-automobiles'
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loginCredentials.token}`)
                .send(newBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            const addedBlog = blogsAtEnd.find(blog => blog.title === 'Trains, Planes, and Automobiles')
            expect(addedBlog.likes).toBe(0)
        })

        test('if \'title\' and \'url\' are missing, respond with \'400 Bad Request\'', async () => {
            const newBlog = {
                url: 'https://www.blogsrus.com/unknown/this-is-an-empty-blog',
                likes: 5
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loginCredentials.token}`)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        })
    })

    describe('update of a blog', () => {
        test('succeeds with status code 200 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            blogToUpdate.likes = 1000

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

            const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
            expect(updatedBlog.likes).toBe(1000)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const newBlog = {
                title: 'Blogs: What are they good for?',
                author: 'Jim Riggins',
                url: 'https://www.blogsrus.com/jimriggins/blogs-what-are-they-good-for',
                likes: 13
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loginCredentials.token}`)
                .send(newBlog)

            const blogToDelete = response.body

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `bearer ${loginCredentials.token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

            const contents = blogsAtEnd.map(r => r.title)
            expect(contents).not.toContain(blogToDelete.title)
        })

        test('fails with status code 401 if user is invalid', async () => {
            const newBlog = {
                title: 'Blogs: What are they good for?',
                author: 'Jim Riggins',
                url: 'https://www.blogsrus.com/jimriggins/blogs-what-are-they-good-for',
                likes: 13
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `bearer ${loginCredentials.token}`)
                .send(newBlog)

            const blogToDelete = response.body

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})