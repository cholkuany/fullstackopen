import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { setInitialBlogs } from "./reducers/blogReducer";
import { login, logout, initializeCurrentUser } from "./reducers/userReducer";

import Container from "@mui/material/Container";

import UserBlogs from "./components/UserBlogs";

import Users from "./components/Users";
import HomePage from "./components/HomePage";
import BlogDetail from "./components/BlogDetail";

import { Routes, Route, useMatch, Link as RouterLink } from "react-router-dom";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.notification);
  const status = useSelector((state) => state.status);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(initializeCurrentUser());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const loginForm = () => {
    return (
      <div>
        {message && (
          <p className={status === "success" ? "success" : "error"}>
            {message}
          </p>
        )}
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit">login</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <>
          {message && <p className="error">{message}</p>}

          {/* NAVBAR */}
          <AppBar
            position="static"
            sx={{
              backgroundColor: "#ffffffff",
              boxShadow: "none",
              borderBottom: "1px solid #ccc",
              padding: 0,
              margin: 0,
            }}
          >
            <Toolbar sx={{ minHeight: 0, padding: 0 }}>
              {/* LEFT SIDE */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{ color: "#3c3c3cff", textDecoration: "none" }}
                >
                  blogs
                </Link>

                <Link
                  component={RouterLink}
                  to="/users"
                  sx={{ color: "#3c3c3cff", textDecoration: "none" }}
                >
                  users
                </Link>
              </Box>

              {/* PUSHES RIGHT SIDE TO THE EDGE */}
              <Box sx={{ flexGrow: 1 }} />

              {/* RIGHT SIDE */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body1" sx={{ color: "#1d1ac3ff" }}>
                  Welcome, {user.username}!
                </Typography>

                <Typography variant="body1" sx={{ color: "#3c3c3cff" }}>
                  |
                </Typography>

                <Button sx={{ color: "#0000ffff" }} onClick={handleLogout}>
                  logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          {/* HEADER BELOW NAVBAR */}
          <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
            blog app
          </Typography>
        </>
      )}
    </div>
  );
};
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(setInitialBlogs());
  }, []);

  useEffect(() => {
    dispatch(initializeCurrentUser());
  }, []);

  const match = useMatch("/users/:id");
  const matchedId = match ? match.params.id : null;

  const matchBlog = useMatch("/blogs/:id");
  const matchBlogId = matchBlog ? matchBlog?.params.id : null;

  return (
    <Container maxWidth="md">
      <Navbar user={user} />
      {user && (
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserBlogs id={matchedId} />} />
          <Route path="/blogs/:id" element={<BlogDetail id={matchBlogId} />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      )}
    </Container>
  );
};

export default App;
