import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../reducers/authorsReducer";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

const Users = () => {
  const dispatch = useDispatch();
  const authors = useSelector((state) => state.authors);
  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  if (authors.length === 0) {
    return <div>No users</div>;
  }

  return (
    <div>
      <h2>Users</h2>

      <TableContainer>
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.map((author) => (
              <TableRow
                key={author.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Link component={RouterLink} to={`/users/${author.id}`}>
                    {author.username}
                  </Link>
                </TableCell>
                <TableCell align="right">{author.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default Users;
