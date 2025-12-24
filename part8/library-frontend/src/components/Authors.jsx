import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Person = ({ authors, notify }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editBorn({ variables: { name, born } });
    setName("");
    setBorn("");
    notify(`Updated birth year for ${name} to ${born}`);
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            name{" "}
            <select value={name} onChange={(e) => setName(e.target.value)}>
              <option value="" disabled>
                Select a name
              </option>
              {authors?.map((a) => {
                return (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <div>
          <label>
            born{" "}
            <input
              type="number"
              value={born}
              onChange={(e) => setBorn(Number(e.target.value))}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

const Authors = (props) => {
  if (!props.show) {
    return null;
  }
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>Loading ...</div>;
  }
  const authors = result.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && <Person authors={authors} notify={props.notify} />}
    </div>
  );
};

export default Authors;
