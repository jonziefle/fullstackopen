var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((previous, current) => {
        let blog = {}
        if (previous.likes > current.likes) {
            blog = { ...previous }
        } else {
            blog = { ...current }
        }

        return {
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }
    }, {})
}

const mostBlogs = (blogs) => {
    // using lodash
    // const blogAuthorsByCount = _.countBy(blogs,'author')

    const blogAuthorsByCount = blogs.reduce((authors, blog) => {
        authors[blog.author] = (authors[blog.author] || 0) + 1
        return authors
    }, {})

    const blogAuthor = Object.entries(blogAuthorsByCount).reduce((a, b) => {
        return a[1] > b[1] ? a : b
    }, [])

    return {
        author: blogAuthor[0],
        blogs: blogAuthor[1]
    }
}

const mostLikes = (blogs) => {
    // using lodash
    // const blogAuthorsGrouped = _.groupBy(blogs, 'author')
    // const blogAuthorsByLikes = _.mapValues(blogAuthorsGrouped, (blog) => {
    //     return blog.reduce((a, b) => a + b.likes, 0)
    // })

    const blogAuthorsByLikes = blogs.reduce((authors, blog) => {
        authors[blog.author] = (authors[blog.author] || 0) + blog.likes
        return authors
    }, {})

    const blogAuthor = Object.entries(blogAuthorsByLikes).reduce((a, b) => {
        return a[1] > b[1] ? a : b
    }, [])

    return {
        author: blogAuthor[0],
        likes: blogAuthor[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}