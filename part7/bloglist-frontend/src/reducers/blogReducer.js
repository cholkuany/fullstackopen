import { createSlice } from "@reduxjs/toolkit";

import blogService from "../services/blogs";
import createBlogService from "../services/create";
import update from "../services/update";
import deleteBlog from "../services/delete";

import { setStatus } from "./statusReducer";
import { setNotificationMessage } from "./notificationReducer";

const descendingSort = (a, b) => b.likes - a.likes;
const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort(descendingSort);
    },
    addBlog(state, action) {
      return [...state, action.payload].sort(descendingSort);
    },
    likeBlog(state, action) {
      const liked = action.payload;
      const updatedBloglist = state
        .map((b) => (b.id === liked.id ? liked : b))
        .sort(descendingSort);
      return updatedBloglist;
    },
    deletedId(state, action) {
      const id = action.payload;
      return state.filter((b) => b.id !== id).sort(descendingSort);
    },
  },
});

export default blogSlice.reducer;
const { setBlogs, addBlog, likeBlog, deletedId } = blogSlice.actions;

export const setInitialBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogData) => {
  return async (dispatch) => {
    const blog = await createBlogService.create(blogData);
    dispatch(addBlog(blog));
  };
};

export const blogToLike = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await update(blog);
    if (updatedBlog) {
      dispatch(likeBlog(updatedBlog));
      dispatch(setStatus("success"));
      dispatch(setNotificationMessage(`You liked '${updatedBlog.title}'`));
    }
  };
};

export const blogToDelete = (blog) => {
  return async (dispatch) => {
    const status = await deleteBlog(blog.id);
    if (status === 204) {
      dispatch(deletedId(blog.id));
      dispatch(setStatus("success"));
      dispatch(setNotificationMessage(`Deleted '${blog.title}'`));
    }
  };
};
