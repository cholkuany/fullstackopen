import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

const selectUserBlogs = createSelector(
  [(state) => state.blogs, (_, userId) => userId],
  (blogs, userId) => {
    const userBlogs = blogs.filter((b) => b.user.id === userId);
    let author = null;
    if (userBlogs.length !== 0) {
      author = blogs[0].user;
    }
    return { userBlogs, author };
  }
);

const UserBlogs = ({ id }) => {
  const { userBlogs, author } = useSelector((state) =>
    selectUserBlogs(state, id)
  );

  if (!userBlogs || userBlogs.length === 0)
    return <div> No blogs for this user</div>;

  return (
    <div>
      <h2>{author.username}</h2>
      <div>
        <h3>added blogs</h3>
        <ul>
          {userBlogs.map((b) => {
            return <li key={b.id}>{b.title}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};
export default UserBlogs;
