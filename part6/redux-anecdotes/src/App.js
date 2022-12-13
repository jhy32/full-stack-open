
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import ConnectedNotification from './components/Notification'
import Filter from './components/Filter'
import {useDispatch} from 'react-redux'
import {useEffect} from 'react'
import anecdoteService from './services/anecdotes'
import {initializeAnecdotes} from './reducers/anecdoteReducer'

const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes()) 
  }, [])


  return (
    <div>
      <ConnectedNotification/> 
      <Filter/>
      <AnecdoteList/>
      <AnecdoteForm/>

    </div>
  )
}

export default App