const baseUrl = 'http://localhost:3001/anecdotes'

export const getAllAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  const data = await response.json()
  return data
}

export const createNew = async (content) => {
  const newAnecdote = { content, votes: 0 }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAnecdote)
  })
  console.log('response(create)', response)
  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }
  const data = await response.json()
  console.log('response(data)', data)
  return data
}

export const updateAnecdote = async (id, updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedAnecdote)
  })
  const data = await response.json()
  return data
} 
