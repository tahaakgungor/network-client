import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import AddUser from "../components/AddUser";
import RoleManagement from "../components/AddRole";
import { useSelector } from "react-redux";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);
  

  const roleNam = useSelector((state) => state.userInformation.roles);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}auth/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}roles/`);
      console.log(response.data);
      setRole(response.data);
    } catch (error) {
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
      const updatedUser = {
        name: selectedUser.name,
        email: selectedUser.email,
        role: roleNam.length === 1 ? roleNam[0].name : role,
      };
  
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}auth/users/${selectedUser._id}`, updatedUser);
  
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}auth/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = (newUser) => {
    setNewUser(newUser);
    fetchUsers();
    setShowAddUser(false);
  };
  
  



  return (
    <div>
      <RoleManagement />
      {selectedUser && (
  <form className="admin-forms" onSubmit={handleUpdateUser}>
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
    <div className="role-changes">
      <label>Role:</label>
      <select value={selectedUser.role} onChange={handleRoleChange}>
        {roleNam.map((role) => (
          <option key={role._id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
    <div className="edit-update-cancel">
      <Button variant="success" onClick={handleUpdateUser}>
        Update
      </Button>
      <Button variant="primary" onClick={() => setSelectedUser(null)}>
        Cancel
      </Button>
    </div>
  </form>
)}
{showAddUser && <AddUser onAddUser={handleAddUser}/>}

{!selectedUser && !showAddUser && (
  <div>
  <div className="admin-form">
    <Table>
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
              <Button variant="primary" onClick={() => handleEditUser(user)}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
          <div className="add-user">
            <Button variant="success" onClick={() => setShowAddUser(true)}>
              Add User
            </Button>
            </div>
          </div>


)}

      
    </div>
    
  );
  
};

export default AdminPanel;
