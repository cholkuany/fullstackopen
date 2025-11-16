import axios from "axios"
const baseUrl = '/api/blogs'

const update = async (blogData) => {
  const localUser = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const config = {
    headers: {
      Authorization: `Bearer ${localUser.token}`
    }
  }
  console.log("BLOGDATA", blogData)
  const blog = await axios.put(`${baseUrl}/${blogData.id}`, {likes: blogData.likes}, config)
  console.log("New blog", blog)
  return blog.data

}

export default update