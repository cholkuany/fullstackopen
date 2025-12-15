import axios from 'axios'
const baseUrl = '/api/blogs'

const deleteBlog = async (blogId) => {
  const localUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const config = {
    headers: {
      Authorization: `Bearer ${localUser.token}`
    }
  }
  const blog = await axios.delete(`${baseUrl}/${blogId}`, config)
  return blog.status
}

export default deleteBlog