const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const reducer = (sum, val) => sum + val.likes
  const total = blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
  return total
}

const favoriteBlog = (blogs) => {
  const reducer = (favBlog, blog) => {
    return favBlog.likes < blog.likes ? blog : favBlog
  }
  const favorite = blogs.length === 0 
    ? {}
    : blogs.reduce(reducer, blogs[0])

    return favorite
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}