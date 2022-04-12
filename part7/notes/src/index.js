import ReactDOM from 'react-dom'
import { useState } from 'react'

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useMatch
} from "react-router-dom"

import Navigation from './components/Navigation'
import Notes from './components/Notes'
import Note from './components/Note'
import Users from './components/Users'
import Login from './components/Login'
import Home from './components/Home'
import Footer from './components/Footer'

import { Alert } from 'react-bootstrap'

const App = () => {
    const [notes, setNotes] = useState([
        {
            id: 1,
            content: 'HTML is easy',
            important: true,
            user: 'Matti Luukkainen'
        },
        {
            id: 2,
            content: 'Browser can execute only JavaScript',
            important: false,
            user: 'Matti Luukkainen'
        },
        {
            id: 3,
            content: 'Most important methods of HTTP-protocol are GET and POST',
            important: true,
            user: 'Arto Hellas'
        }
    ])

    const [user, setUser] = useState(null)
    const [message, setMessage] = useState(null)

    const match = useMatch('/notes/:id')

    const note = match
        ? notes.find(note => note.id === Number(match.params.id))
        : null


    const login = (user) => {
        setUser(user)
        setMessage(`Welcome ${user}`)
        setTimeout(() => {
            setMessage(null)
        }, 3000)
    }

    return (
        <div className="container">
            {(message &&
                <Alert variant="success">
                    {message}
                </Alert>
            )}
            <Navigation user={user} />
            <Routes>
                <Route path="/notes/:id" element={<Note note={note} />} />
                <Route path="/notes" element={<Notes notes={notes} />} />
                <Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onLogin={login} />} />
                <Route path="/" element={<Home />} />
            </Routes>
            <Footer />
        </div>
    )
}

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
)