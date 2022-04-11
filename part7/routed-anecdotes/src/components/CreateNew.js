import { useNavigate } from "react-router-dom"
import { useField } from '../hooks'

const CreateNew = ({ addNew, setNotification }) => {
    const navigate = useNavigate()

    const content = useField('content', 'text')
    const author = useField('author','text')
    const info = useField('info','text')

    const handleSubmit = (event) => {
        event.preventDefault()

        const newAnecdote = {
            content: content.attributes.value,
            author: author.attributes.value,
            info: info.attributes.value,
            votes: 0
        }
        addNew(newAnecdote)

        navigate('/')
        setNotification(`A new anecdote "${newAnecdote.content}" was created!`)
        setTimeout(() => setNotification(''), 5000)
    }

    const handleReset = (event) => {
        event.preventDefault()

        content.reset()
        author.reset()
        info.reset()
    }

    return (
        <div>
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content
                    <input {...content.attributes} />
                </div>
                <div>
                    author
                    <input {...author.attributes} />
                </div>
                <div>
                    url for more info
                    <input {...info.attributes} />
                </div>
                <button type="submit">create</button>
                <button type="reset" onClick={handleReset}>reset</button>
            </form>
        </div>
    )
}

export default CreateNew