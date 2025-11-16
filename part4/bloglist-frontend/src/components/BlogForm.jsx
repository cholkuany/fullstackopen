import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault()
    const success = await createBlog({title, author, url})
    if(success) {
      setAuthor("")
      setTitle("")
      setUrl("")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title:
            <input 
              type='text'
              onChange={({target}) => setTitle(target.value)}
              value={title}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input 
              type='text'
              onChange={({target}) => setAuthor(target.value)}
              value={author}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input 
              type='text'
              onChange={({target}) => setUrl(target.value)}
              value={url}
            />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm