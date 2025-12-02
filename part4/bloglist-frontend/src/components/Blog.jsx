import { useState } from "react"
import update from "../services/update"
import deleteBlog from "../services/delete"

const Blog = ({ blog, setBlogs }) => {
  const [show, setShow] = useState(false)
  let isOwner = null
  const loggedInUser = JSON.parse(window.localStorage.getItem("loggedInUser"))
  if(loggedInUser){
    if(blog.user){
      isOwner = loggedInUser.username === blog.user.username
    }
  }
  const onLike = async() => {
    const blogLiked = await update({...blog, likes: blog.likes + 1})
    if(blogLiked){
      setBlogs(blogs => blogs.map(b => b.id === blogLiked.id ? blogLiked : b).sort((a,b) => b.likes - a.likes))
    }
  }
  const onDelete = async() => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}`)){
      const status = await deleteBlog(blog.id)
      if(status === 204){
        setBlogs(blogs => blogs.filter(b => b.id !== blog.id).sort((a,b) => b.likes - a.likes))
      }
    }
  }
  return (
    <div className="blog">
      <div>
        <div>
          {blog.title} {blog.author} 
          <button style={{marginLeft: '5px'}} onClick={() => setShow(!show)}>
            {show ? "hide" : "view"}
          </button>
        </div>
        {
          show &&
          <div>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes}
              <button onClick={onLike} id="likeButton">like</button>
            </div>
            {blog.user && <div>{blog.user.name}</div>}
            {
              isOwner && 
              <div>
                <button onClick={onDelete}>remove</button>
              </div>
            }
          </div>}
      </div>
    </div>
  )  
}

export default Blog