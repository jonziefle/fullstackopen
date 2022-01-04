const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

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
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain('Blogs: What are they good for?')
    })

    test('if the \'likes\' property is missing, it will default to 0', async () => {
        const newBlog = {
            title: 'Trains, Planes, and Automobiles',
            author: 'Greg Williams',
            url: 'https://www.blogsrus.com/gregwilliams/trains-planes-and-automobiles'
        }

        await api
            .post('/api/blogs')
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
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})