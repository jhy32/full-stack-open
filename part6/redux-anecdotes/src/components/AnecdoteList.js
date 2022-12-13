import { useSelector, useDispatch } from 'react-redux'
import {addVoteToAnecdote} from '../reducers/anecdoteReducer'
import {setAndRemoveNotification} from '../reducers/notificationReducer'

const AnecdoteList = () => {

    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const dispatch = useDispatch()

    const vote = async (anecdote) => {
        dispatch(addVoteToAnecdote(anecdote))
        dispatch(setAndRemoveNotification(`You voted for ${anecdote.content}`, 8))
    }

    return (
    <div>
    <h2>Anecdotes </h2>
    
    {anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).map(anecdote =>
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
    </div>
    )
}

export default AnecdoteList