import { useState } from "react";

const BlogForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await handleSubmit({ title, author, url });
    if (ok) {
      setAuthor("");
      setTitle("");
      setUrl("");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            title:
            <input
              type="text"
              onChange={({ target }) => setTitle(target.value)}
              value={title}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              onChange={({ target }) => setAuthor(target.value)}
              value={author}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              onChange={({ target }) => setUrl(target.value)}
              value={url}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
