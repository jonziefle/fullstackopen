const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

// get all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

// add new blog
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const user = request.user
    if (!user) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    let savedBlog = await blog.save()
    savedBlog  =  await savedBlog.populate('user', { username: 1, name: 1 })
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

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

    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { runValidators: true, new: true })
        .populate('user', { username: 1, name: 1 })
    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

// delete blog
blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(400).json({
            error: 'Invalid blog for deletion',
        })
    }

    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({
            error: 'Unauthorized to delete this blog',
        })
    }
})

module.exports = blogsRouter