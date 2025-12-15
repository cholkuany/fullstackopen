import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

const Blog = ({ blog }) => {
  return (
    <Link component={RouterLink} to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  );
};

export default Blog;
