import { useQuery } from "@apollo/client/react";

import { ALL_BOOKS } from "../queries";

const Recommendation = ({ genre }) => {
  const result = useQuery(ALL_BOOKS);
  if (!genre) {
    return <div>no favorite genre set</div>;
  }
  if (result.loading) {
    return <div>Loading...</div>;
  }
  const books = result.data.allBooks.filter((b) => b.genres.includes(genre));
  return (
    <div>
      <h2>recommendations</h2>
      <div>
        <p>
          books in your favorite genre <strong>{genre}</strong>
        </p>
        <div>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {books.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
