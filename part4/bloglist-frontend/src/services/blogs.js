import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async() => {
  const blogs = await axios.get(baseUrl)
  console.log('All Blogs', blogs)
  return blogs.data
}

export default { getAll }