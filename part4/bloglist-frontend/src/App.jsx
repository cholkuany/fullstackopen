import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import createService from './services/create'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedInUser'))
    if(user){
      createService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async(e) => {
    e.preventDefault()
    const user = await loginService.login({username, password})
    if(user){
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      createService.setToken(user.token)
      // setMessage('✅ You are logged in!')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    // setMessage('🔒 You are logged out!')
    createService.setToken(null)
    setUser(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const blog = await createService.create({title, author, url})
      setAuthor("")
      setTitle("")
      setUrl("")
      setMessage(`${blog.title} by ${blog.author} added`)
    }catch(error) {
      console.log(error.message)
      setMessage(`${error.message} or login session expired!`)
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input 
                type="text" 
                value={username} 
                onChange={({target}) => setUsername(target.value)} 
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input 
                type='password' 
                value={password} 
                onChange={({target}) => setPassword(target.value)} 
              />
            </label>
          </div>
          <div>
            <button type='submit'>login</button>
          </div>
        </form>
      </div>
    )
  }

  const blogForm = () => {
    return (
      <div>
        <h2>add blog</h2>
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

  return (
    <div>
      {!user && loginForm()}
      {
        user && 
        <>
          <h2>blogs</h2>
          {message && <p className='error'>{message}</p>}
          <div>
            <div>
              <p>{user.username} logged in 
                <span>
                  <button onClick={handleLogout}>logout</button>
                </span>
              </p>
            </div>
            <div>{blogForm()}</div>
          </div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      }
    </div>
  )
}

export default App