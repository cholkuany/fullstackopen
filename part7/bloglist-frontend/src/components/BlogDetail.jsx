import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import { blogToLike, blogToDelete } from "../reducers/blogReducer";

import addComment from "../services/addComment";
import getComments from "../services/getComments";

const BlogDetail = ({ id }) => {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const comments = await getComments({ id });
        if (comments) {
          setComments(comments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComment();
  }, [id]);

  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id));

  if (!blog || blog.length === 0) {
    return <div> Blog not found!</div>;
  }

  let isOwner = null;
  const loggedInUser = JSON.parse(window.localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    if (blog.user) {
      isOwner = loggedInUser.username === blog.user.username;
    }
  }

  const handleLike = async () => {
    dispatch(blogToLike({ ...blog, likes: blog.likes + 1 }));
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      dispatch(blogToDelete(blog));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;
    e.target.comment.value = "";
    try {
      const comment = await addComment({ id, text });
      console.log(comment);
      setComments((prevComments) => [...prevComments, ...comment.comments]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h2>
          {blog.title} {blog.author}
        </h2>
        <div>
          <a href={`${blog.url}`}>{blog.url}</a>
          <div>
            {blog.likes} likes
            <button onClick={handleLike} id="likeButton">
              like
            </button>
          </div>
          {blog.user && <div>added by {blog.user.name}</div>}
          {isOwner && (
            <div>
              <button onClick={handleDelete}>remove</button>
            </div>
          )}
        </div>
      </div>
      <div>
        <h3>comments</h3>
        <div>
          <form onSubmit={handleSubmit}>
            <input name="comment" placeholder="add comment..." />
            <button type="submit">add comment</button>
          </form>
          {comments.length === 0 ? (
            <div className="comments">no comments</div>
          ) : (
            <ul className="comments">
              {comments.map((text, index) => {
                return <li key={index}>{text}</li>;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
