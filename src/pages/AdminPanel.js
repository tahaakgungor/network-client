import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Table } from "react-bootstrap";
import Header from "../components/Header";
import RoleManagement from "../components/AddRole";
import { useSelector } from "react-redux";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");

  const userInfo = useSelector(
    (state) => state.userInformation.userInformation
  );
  const roleNam = useSelector((state) => state.userInformation.roles);
  console.log(roleNam);

  console.log(userInfo);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/roles");
      setRole(response.data);
    }
  catch (error) {
    console.error(error);
  }
};

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setRole(newRole);
    setSelectedUser({ ...selectedUser, role: newRole });
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`http://localhost:5000/auth/users/${selectedUser._id}`, {
        name: selectedUser.name,
        email: selectedUser.email,
        role: role,
      });

      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };


  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/auth/users/${userId}`);

      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <RoleManagement />
      {selectedUser ? (
        <form onSubmit={handleUpdateUser}>
          <h2>Edit User</h2>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={selectedUser.name}
              onChange={(event) =>
                setSelectedUser({ ...selectedUser, name: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={selectedUser.email}
              onChange={(event) =>
                setSelectedUser({ ...selectedUser, email: event.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Role:</label>
            <select value={selectedUser.role} onChange={handleRoleChange}>
              {roleNam.map((role) => (
                <option key={role._id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button type="submit">Update</Button>
            <Button onClick={() => setSelectedUser(null)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button onClick={() => handleEditUser(user)}>Edit</Button>
                  <Button onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminPanel;
