import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])
  useEffect(() => {
    const fetch = async() => {
      await getAll()
      // setResources(response)
    }
    fetch()
  }, [baseUrl])
  const getAll = async() => {
    const response = await axios.get(baseUrl)
    // return blogs.data
    setResources(response.data)
    return;
  }

  const create = async (resource) => {
    const config = {
      headers: {
        Authorization: ""
      }
    }

    const response = await axios.post(baseUrl, resource, config)
    console.log('New blog (create)', response.data)
    // return blog.data
    setResources((prevResources) => [...prevResources, response.data])
  }

  const service = {
    create,
    getAll
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('/api/notes')
  const [persons, personService] = useResource('http://localhost:3001/api/persons')

  console.log("NOTES", notes)
  console.log("PERSONS", persons)

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App