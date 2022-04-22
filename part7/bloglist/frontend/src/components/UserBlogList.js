import React from "react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const UserBlogList = ({ userDetails, userBlogs }) => {
  if (!userDetails) {
    return null;
  }
  if (userBlogs.length === 0) {
    return (
      <div>
        <h2>{userDetails.name}</h2>
        <h3>no blogs added</h3>
      </div>
    );
  }
  return (
    <div>
      <h2>{userDetails.name}</h2>
      <h3>added blogs</h3>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {userBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserBlogList;
