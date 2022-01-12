import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newURL, setNewURL] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({})

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const authorizedUserJSON = window.localStorage.getItem('authorizedUser')
        if (authorizedUserJSON) {
            const user = JSON.parse(authorizedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'authorizedUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            displayMessage(`${username} logged in`, 'message')
            setUsername('')
            setPassword('')
        } catch (exception) {
            displayMessage(`Unable to login ${username}`, 'error')
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()

        window.localStorage.removeItem('authorizedUser')
        blogService.setToken(null)
        displayMessage(`${user.username} logged out`, 'message')
        setUser(null)
    }

    const addBlog = async (event) => {
        event.preventDefault()

        const blogObject = {
            title: newTitle,
            author: newAuthor,
            url: newURL
        }

        try {
            const tester = await blogService.create(blogObject)
            setBlogs(blogs.concat(tester))

            displayMessage(`Added new blog '${newTitle}' by ${newAuthor}`, 'message')
            setNewTitle('')
            setNewAuthor('')
            setNewURL('')
        } catch (exception) {
            displayMessage(`Unable to add blog '${newTitle}' by ${newAuthor}`, 'error')
        }
    }

    const displayMessage = (text, type) => {
        setMessage({ text, type })
        setTimeout(() => {
            setMessage({})
        }, 5000)
    }

    const handleTitleChange = (event) => setNewTitle(event.target.value)
    const handleAuthorChange = (event) => setNewAuthor(event.target.value)
    const handleURLChange = (event) => setNewURL(event.target.value)

    const notification = () => {
        if (message === null) {
            return null
        }

        return (
            <div className={message.type}>
                {message.text}
            </div>
        )
    }

    const loginForm = () => (
        <>
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </>
    )

    const blogUser = () => (
        <>
            <h3>User</h3>
            <div>{user.name} logged-in</div>
            <button onClick={handleLogout}>logout</button>
        </>
    )

    const blogForm = () => (
        <>
            <h3>Add Blog</h3>
            <form onSubmit={addBlog}>
                <div>
                    title:<input value={newTitle} onChange={handleTitleChange} />
                </div>
                <div>
                    author:<input value={newAuthor} onChange={handleAuthorChange} />
                </div>
                <div>
                    url:<input value={newURL} onChange={handleURLChange} />
                </div>
                <button type="submit">create</button>
            </form>
        </>
    )

    const blogList = () => (
        <>
            <h3>List</h3>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </>
    )

    return (
        <div>
            <h2>Blog List App</h2>
            {notification()}
            {user === null ?
                <div>
                    {loginForm()}
                </div>
                :
                <div>
                    {blogUser()}
                    {blogForm()}
                    {blogList()}
                </div>
            }
        </div>
    )
}

export default App