import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNew} from "../services/anecdotes"
import AnecdoteContext from "../AnecdoteContext"
import { useContext } from "react"

const AnecdoteForm = () => {
  const { anecdoteDispatch } = useContext(AnecdoteContext)
  const queryClient = useQueryClient()

  let timeoutId = null
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      console.log('anecdote created:', newAnecdote)
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      anecdoteDispatch({type: "CREATE", message: newAnecdote.content})
      if(timeoutId){
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        anecdoteDispatch({type: "CLEAR", message: ""})
        timeoutId = null
      },5000)
    },
    onError: (error) => {
      anecdoteDispatch({type: "ERROR", message: error.message})
      if(timeoutId){
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        anecdoteDispatch({type: "CLEAR", message: ""})
        timeoutId = null
      },5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
