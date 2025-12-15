import axios from "axios";
const baseUrl = "/api/blogs";

const addComment = async (data) => {
  const blog = await axios.post(`${baseUrl}/${data.id}/comments`, {
    commentText: data.text,
  });
  return blog.data;
};

export default addComment;
