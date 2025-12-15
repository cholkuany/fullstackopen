import axios from "axios";
const baseUrl = "/api/blogs";

const getComments = async (data) => {
  const comments = await axios.get(`${baseUrl}/${data.id}/comments`);
  return comments.data;
};

export default getComments;
