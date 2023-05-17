import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import AddUser from "../components/AddUser";
import RoleManagement from "../components/AddRole";
import UserLog from "./UserLog";
import "../styles/AdminPanel.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetchUsers();
    fetchUserLastLog();
    const interval = setInterval(() => {
      fetchUserLastLog();
      fetchRoles();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
  }, []);

  const fetchUserLastLog = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}auth/users`
      );
      const usersWithLogs = await Promise.all(
        response.data.map(async (user) => {
          const logResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}logs/user/last/${user._id}`
          );
          const log = logResponse.data[0];
          return {
            ...user,
            lastLog: log,
          };
        })
      );
      setUsers(usersWithLogs);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}auth/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}roles`
      );
      setRoles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    if (!newRole) {
      setRole(roles[0].name);
    } else {
      setRole(newRole);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    try {
      const updatedUser = {
        name: selectedUser.name,
        email: selectedUser.email,
        role: role || roles[0].name,
      };

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}auth/users/${selectedUser._id}`,
        updatedUser
      );


      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    setShowDeleteModal(false);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}auth/users/${userId}`
      );
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
    {!selectedUser ? null : (
      <div className="modal-container">
  <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Edit User</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleUpdateUser}>
        <div className="form-group">
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
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={selectedUser.email}
            onChange={(event) =>
              setSelectedUser({
                ...selectedUser,
                email: event.target.value,
              })
            }
            required
          />
        </div>
        <div className="form-group role-changes">
          <label>Role:</label>
          <select value={role} onChange={handleRoleChange}>
            {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group edit-update-cancel">
          <Button variant="success" type="submit">
            Update
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal.Body>
  </Modal>
</div>


    )}
      <AddUser
        onAddUser={handleAddUser}
        setShowModal={setShowAddUser}
        showModal={showAddUser}
      />


      <div>
        <div className="admin-form">
          <Table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>
                    {user.lastLog?.status === "login" ? (
                      <span style={{ color: "green" }}>Online</span>
                    ) : (
                      <span style={{ color: "red" }}>Offline</span>
                    )}
                  </td>

                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        history.push({
                          pathname: `/userlog/${user._id}`,
                          state: { user },
                        });
                      }}
                    >
                      Log
                    </Button>{" "}
                    <Button
                      variant="primary"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Delete Device</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this device?</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Close
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                    <Button
                      variant="danger"
                      onClick={() => setShowDeleteModal(true)}
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
          <Button variant="primary" onClick={() => setShowAddUser(true)}>
            Add User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
