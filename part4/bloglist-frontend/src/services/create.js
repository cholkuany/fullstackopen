import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}
const create = async (blogData) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const blog = await axios.post(baseUrl, blogData, config)
  console.log('New blog (create)', blog.data)
  return blog.data

}

export default { create, setToken }