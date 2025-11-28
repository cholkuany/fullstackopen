import { useEffect } from 'react'

import AnecdotesForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])
  return (
    <div>
      <AnecdoteList />
      <AnecdotesForm />
    </div>
  )
}

export default App
