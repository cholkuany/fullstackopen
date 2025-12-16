import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";

import { LOGIN_USER } from "../queries";

const LoginForm = ({ setPage, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN_USER, {
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (result.data?.login) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("currentUser-token", token);
      setPage("authors");
    }

    console.log("data", result.data);
  }, [result.data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };
  if (result.loading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            name{" "}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password{" "}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

export default LoginForm;
