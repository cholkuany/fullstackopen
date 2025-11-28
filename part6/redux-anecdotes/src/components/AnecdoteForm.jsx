import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdotesForm = () => {
  const dispatch = useDispatch()
  
  const onAdd = async event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
    dispatch(setNotificationWithTimeout(`You created '${content}'`))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onAdd}>
        <div>
          <input name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdotesForm