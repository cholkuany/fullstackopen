import { createContext, useReducer } from "react";

const AnecdoteContext = createContext()

const anecdoteReducer = (state = "", action) => {
  switch(action.type){
    case 'VOTE':
      return `anecdote '${action.message}' voted`
    case 'CREATE':
      return `anecdote '${action.message}' created`
    case 'ERROR':
      return `'${action.message}' - minimum length (5)`
    case "CLEAR":
      return action.message
    default:
      return state
  }
}

export const AnecdoteContextProvider = (props) => {
  const [notification, anecdoteDispatch] = useReducer(anecdoteReducer, "")

  return (
    <AnecdoteContext.Provider value={{notification, anecdoteDispatch}}>
      {props.children}
    </AnecdoteContext.Provider>
  )
}

export default AnecdoteContext