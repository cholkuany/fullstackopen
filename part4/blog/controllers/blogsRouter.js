const blogsRouter = require("express").Router();

const logger = require("../utils/logger");
const Blog = require("../models/blogs");
const Comment = require("../models/comments");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  response.json(blog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const blogId = request.params.id;

  const user = request.user;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (!user) {
    return response.status(401).json({ error: "unauthorized user" });
  }

  if (user._id.toString() === blog.user.toString()) {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (deletedBlog) {
      user.blogs = user.blogs.filter((blogId) => {
        return blogId.toString() !== deletedBlog._id.toString();
      });
      await user.save();
    }
    return response.status(204).end();
  }

  return response.status(401).json({ error: "unauthorized request" });
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;
  const blog = await Blog.findById(id);

  blog.likes = likes;
  const updatedBlog = await blog.save();
  await updatedBlog.populate("user", { username: 1, name: 1 });
  response.json(updatedBlog);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: "invalid user" });
  }

  const blog = new Blog({ ...body, user: user._id });

  const savedBlog = await blog.save();
  await savedBlog.populate("user", { username: 1, name: 1 });

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id/comments", async (request, response) => {
  const id = request.params.id;
  try {
    const blogComments = await Comment.find({ blog: id });
    const comments = blogComments[0].comments;
    response.json(comments);
  } catch {
    response.json([]);
  }
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const id = request.params.id;
  const { commentText } = request.body;

  let commentDoc = await Comment.findOne({ blog: id });

  if (!commentDoc) {
    // first comment → create document
    commentDoc = await Comment.create({
      blog: id,
      comments: [commentText],
    });
  } else {
    // comments already exist → push to array
    commentDoc.comments.push(commentText);
    await commentDoc.save();
  }

  return response.json(commentDoc);
});

module.exports = blogsRouter;
