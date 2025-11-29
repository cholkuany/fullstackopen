const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () =>{
  const response = await fetch(baseUrl)
  if(!response.ok) {
    throw new Error('Error fetching anecdotes')
  }
  const data = await response.json()
  return data
}

export const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({content, votes: 0}),
  })

  if (!response.ok) {
    throw new Error('Error creating anecdote')
  }

  const data = await response.json()
  return data
}

export const updateAnecdote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(anecdote),
  })

  return await response.json()
}