import { useSelector, useDispatch } from "react-redux"

import { voteUpdate } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from "../reducers/notificationReducer"

import Filter from './Filter'
import Notification from './Notification'

const AnecdoteList = () => {

  const anecdotes = useSelector(state => {
    const anecdotes = state.filter === ''
      ? state.anecdotes
      : state.anecdotes.filter(anecdote => 
          anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
        )
    return anecdotes
  })

  const dispatch = useDispatch()

  const vote = (id, content) => {
    dispatch(voteUpdate(id))
    dispatch(setNotificationWithTimeout(`You voted '${content}'`))

  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList