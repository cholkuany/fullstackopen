import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useNotes = (url) => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])
  return notes
}

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL)


  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      <div className='bg-gradient-horizontal'></div>
      <div className='bg-gradient-vertical'></div>
      <div className="header">
        hello webpack {counter} clicks
      </div>
      <button 
        className="button" 
        onClick={handleClick}
      >
        press
      </button>
      <div className='notes'>{notes.length} notes on server {BACKEND_URL}</div>
    </div>
  )
}

export default App