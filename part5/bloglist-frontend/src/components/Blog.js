import React, { useState } from 'react'

const Blog = ({ user, blog, updateBlog, deleteBlog }) => {
    const [visible, setVisible] = useState(false)

    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const incrementLikes = (event) => {
        event.preventDefault()
        updateBlog({
            ...blog,
            likes: blog.likes + 1
        })
    }

    const removeBlog = (event) => {
        event.preventDefault()
        deleteBlog(blog)
    }

    return (
        <div className='blog'>
            {`"${blog.title}" by ${blog.author}`}
            <button className='toggle-button' onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
            <div className='additional-content' style={showWhenVisible}>
                <div>
                    url: {blog.url}
                </div>
                <div>
                    likes: {blog.likes}<button className='like-button' onClick={incrementLikes}>like</button>
                </div>
                <div>
                    user: {blog.user ? blog.user.name : ''}
                </div>
                {blog.user && blog.user.username === user.username &&
                    <button onClick={removeBlog}>remove</button>
                }
            </div>
        </div >
    )
}

export default Blog