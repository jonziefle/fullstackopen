import React, { useState } from 'react'

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('')

    const handleChange = (event) => {
        setNewNote(event.target.value)
    }

    const addNote = (event) => {
        event.preventDefault()
        createNote({
            content: newNote,
            important: false,
        })

        setNewNote('')
    }

    return (
        <div className='formDiv'>
            <h2>Create a note</h2>
            <form onSubmit={addNote}>
                <input
                    className='note-input'
                    value={newNote}
                    onChange={handleChange}
                />
                <button className='save-button' type='submit'>save</button>
            </form>
        </div>
    )
}

export default NoteForm