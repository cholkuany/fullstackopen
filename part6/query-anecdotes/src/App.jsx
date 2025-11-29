import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import AnecdoteContext from './AnecdoteContext'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, updateAnecdote } from './services/anecdotes'

const App = () => {
  const { anecdoteDispatch } = useContext(AnecdoteContext)
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
  })
  let timeoutId = null
  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      anecdoteDispatch({ type: "VOTE", message: updatedAnecdote.content})
      if(timeoutId){
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        anecdoteDispatch({type: "CLEAR", message: ""})
        timeoutId = null
      },5000)
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map(a =>
        a.id === updatedAnecdote.id ? updatedAnecdote : a
      )
      queryClient.setQueryData(
        ['anecdotes'],
        updatedAnecdotes
      )
    },
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    voteMutation.mutate(votedAnecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
