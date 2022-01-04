const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// get all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// add new blog
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    const savedBlog = await blog.save()
    response.json(savedBlog)
})

// update blog
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { runValidators: true, new: true })
    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

// delete blog
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter