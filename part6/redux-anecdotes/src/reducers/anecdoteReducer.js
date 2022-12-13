import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)
//   if (action.type === "ADD_ANECDOTE") {
//     console.log('reducing')
//     state = state.concat(asObject(action.anecdote))
//   } else if (action.type === "ADD_VOTE") {
//     const anecdoteToUpdate = state.find(s => s.id === action.id)
//     const newAnecdote = {...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1}
//     state = [...state]
//     state.splice(state.indexOf(anecdoteToUpdate), 1)
//     state = state.concat(newAnecdote)
//   }
//   state = [...state].sort((a, b) => b.votes - a.votes)
//   // state = state.reverse()
//   return state
// }

const sortAnecdotes = (anecdotes) => {
  anecdotes.sort((a, b) => b.votes - a.votes)
  // anecdotes = anecdotes.reverse()
  return anecdotes
}

const anecdoteSlice = createSlice({
  name: "anecdotes", 
  initialState, 
  reducers:{
    createAnecdote(state, action) {
      // return sortAnecdotes(state.concat(asObject(action.payload)))
      return sortAnecdotes(state.concat(action.payload))
    }, 
    updateAnecdote(state, action) {
      const id = action.payload
      const anecdoteToUpdate = state.find(s => s.id === id)
      const newAnecdote = {...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1}
      state = state.map(a => a.id !== id ? a : newAnecdote) 
      return sortAnecdotes(state)  
    }, 
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.postAnecdote({'content': content, 'votes': 0})
    dispatch(createAnecdote(newAnecdote))
  }
}

export const addVoteToAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.putAnecdote({...anecdote, "votes":anecdote.votes+1})
    dispatch(updateAnecdote(anecdote.id))
  }
}



// export const createAnecdote = (content) => {
//   return {type: "ADD_ANECDOTE", id: null, anecdote: content}
// }

// export const createVote = (id) => {
//   return {type: "ADD_VOTE", id: id, anecdote: null}
// }

export default anecdoteSlice.reducer
export const { createAnecdote, updateAnecdote, setAnecdotes} = anecdoteSlice.actions
