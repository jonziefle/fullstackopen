import { useDispatch, useSelector } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'
import { showNotification, hideNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
        if (state.filter !== '') {
            return state.anecdotes.filter((anecdote) =>
                anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
            )
        } else {
            return state.anecdotes
        }
    })

    const vote = (anecdote) => {
        dispatch(incrementVote(anecdote.id))
        dispatch(showNotification(`You voted for "${anecdote.content}"`))
        setTimeout(() => {
            dispatch(hideNotification())
        }, 5000)
    }

    const sortByVotes = (a, b) => b.votes - a.votes

    return (
        <>
            {[...anecdotes].sort(sortByVotes).map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </>

    )
}

export default AnecdoteList