import { useRef } from "react";
import { useSelector } from "react-redux";

import Blog from "./Blog";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const HomePage = () => {
  const blogs = useSelector((state) => state.blogs);
  const blogFormRef = useRef();

  const handleSubmit = async ({ title, author, url }) => {
    try {
      dispatch(createBlog({ title, author, url }));
      dispatch(setNotificationMessage(`${title} by ${author} added`));
      dispatch(setStatus("success"));
      blogFormRef.current.toggleVisibility();
      return true;
    } catch (error) {
      dispatch(
        setNotificationMessage(`${error.message} or login session expired!`)
      );
      dispatch(setStatus("error"));
      return false;
    }
  };

  const blogForm = () => {
    return (
      <Togglable buttonLabel="add blog" ref={blogFormRef}>
        <BlogForm handleSubmit={handleSubmit} />
      </Togglable>
    );
  };

  return (
    <div>
      <div>{blogForm()}</div>

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, tableLayout: "fixed" }}
          aria-label="simple table"
        >
          <TableBody>
            {blogs.map((blog) => (
              <TableRow
                key={blog.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  <Blog key={blog.id} blog={blog} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HomePage;
