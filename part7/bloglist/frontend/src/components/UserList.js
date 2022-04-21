import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  return (
    <tr>
      <th>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </th>
      <td>{user.blogs.length}</td>
    </tr>
  );
};

const UserList = () => {
  const users = useSelector((state) => state.users);

  return (
    <div className="user-list">
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
