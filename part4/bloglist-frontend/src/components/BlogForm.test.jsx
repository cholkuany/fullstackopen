import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

describe("BlogForm component", () => {
  test("form calls createBlog with correct details", async () => {
    const createBlog = vi.fn().mockResolvedValue(true)
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    // get inputs
    const titleInput = screen.getByLabelText(/title:/i)
    const authorInput = screen.getByLabelText(/author:/i)
    const urlInput = screen.getByLabelText(/url:/i)
    const submitButton = screen.getByText("create")

    // fill form
    await user.type(titleInput, "Testing Blog")
    await user.type(authorInput, "Test Author")
    await user.type(urlInput, "http://example.com")

    // submit
    await user.click(submitButton)

    // ensure createBlog was called once
    expect(createBlog).toHaveBeenCalledTimes(1)

    // ensure correct data was sent
    expect(createBlog).toHaveBeenCalledWith({
      title: "Testing Blog",
      author: "Test Author",
      url: "http://example.com"
    })
  })
})
