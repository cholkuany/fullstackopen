import { useState } from "react"
import update from "../services/update"
import deleteBlog from "../services/delete"

const Blog = ({ blog }) => {
  const [show, setShow] = useState(false)
  let isOwner = null
  const loggedInUser = JSON.parse(window.localStorage.getItem("loggedInUser"))
  if(loggedInUser){
    if(blog.user){
      isOwner = loggedInUser.username === blog.user.username
    }
  }
  const onLike = async() => {
    blog = {...blog, likes: blog.likes + 1}
    const newBlog = await update(blog)
    console.log(newBlog)
  }
  const onDelete = async() => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}`)){
      const deletedBlog = await deleteBlog(blog.id)
      console.log("DELETED BLOG", deletedBlog)
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
              <button onClick={onLike}>like</button>
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