import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div className="blog-list">
      <h3>Blog List</h3>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {[...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
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

export default BlogList;
