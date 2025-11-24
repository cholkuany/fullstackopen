import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import update from '../services/update'

// mock the update module using Vitest
vi.mock("../services/update", () => ({
  default: vi.fn()
}))


describe('<Blog />', () => {

  const blog = {
    id: "12345",
    author: "chol",
    title: "some title",
    url: "some/url/add",
    likes: 0,
    user: { username: "tester", name: "Test User" }
  }
  beforeEach(() => {
    // Simulate logged in user so isOwner logic doesn't break anything
    window.localStorage.setItem("loggedInUser", JSON.stringify({ username: "tester" }))
  })


  test("displays title and author only", async () => {

    const user = userEvent.setup()

    render( <Blog blog={blog} />)

    const authorElement = screen.getByText("chol", { exact: false})
    const titleElement = screen.getByText("some title", { exact: false})

    expect(authorElement).toBeDefined()
    expect(titleElement).toBeDefined()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlElement = screen.getByText("some/url/add")
    const likesElement = screen.getByText("0", {exact: false})

    expect(urlElement).toBeDefined()
    expect(likesElement).toBeDefined()

  })


  test("calls the like handler twice when like button is clicked twice", async () => {

    const user = userEvent.setup()
    render(<Blog blog={blog} />)

    // reveal detailed view (where like button is)
    const viewButton = screen.getByText("view")
    await user.click(viewButton)

    // click like button
    const likeButton = screen.getByText("like")
    await user.click(likeButton)
    await user.click(likeButton)

    // verify update was called twice
    expect(update).toHaveBeenCalledTimes(2)

    // verify correct updated blog object sent to update()
    expect(update).toHaveBeenCalledWith({
      ...blog,
      likes: blog.likes + 2
    })
  })
  
})
