import { createSlice } from "@reduxjs/toolkit"

import { getAllAnecdotes, createNew, updateAnecdote } from "../services/anecdotes"

const sortByVotes = (a, b) => b.votes - a.votes

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action){
      const changedAnecdote = action.payload

      return state.map(anecdote =>
        anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote
      ).sort(sortByVotes)
    },

    createAnecdote(state, action){
      const newAnecdote = action.payload
      return [...state, newAnecdote].sort(sortByVotes)
    },

    setAnecdotes(state, action) {
      return action.payload.sort(sortByVotes)
    }
  }
})

const { setAnecdotes, createAnecdote, voteAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => { 
  return async(dispatch) => {
    const anecdotes = await getAllAnecdotes()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const voteUpdate = (id) => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes
    const anecdoteToChange = anecdotes.find(a => a.id === id)
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }
    const savedAnecdote = await updateAnecdote(id, changedAnecdote)
    console.log('savedAnecdote(voteUpdate)', savedAnecdote)
    dispatch(voteAnecdote(savedAnecdote))
  }
}

export default anecdoteSlice.reducer