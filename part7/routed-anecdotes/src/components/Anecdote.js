const Anecdote = ({ anecdote }) => {
    return (
        <div>
            <h2>{anecdote.content}</h2>
            <div>author: {anecdote.author}</div>
            <div>url: <a href={anecdote.info}>{anecdote.info}</a></div>
            <div>votes: {anecdote.votes}</div>
        </div>
    )
}

export default Anecdote