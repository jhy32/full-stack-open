import {connect} from 'react-redux'
import {addAnecdote} from '../reducers/anecdoteReducer'
import {setAndRemoveNotification} from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'




const AnecdoteForm = (props) => {

  const addNewAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    //can also update locally first (toObject) before updating backend
    // if do not want to use JSON server's default ID 
    props.addAnecdote(content)
    props.setAndRemoveNotification(`You added ${content}`, 8)
}

  return (
    <div> 
      
    <h2>create new</h2>
    <form onSubmit = {addNewAnecdote}>
      <div><input name = "anecdote"/></div>
      <button>create</button>
    </form>
    </div>
  )
}

const mapDispatchToProps = {
  addAnecdote,
  setAndRemoveNotification
}


const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm)
export default ConnectedAnecdoteForm