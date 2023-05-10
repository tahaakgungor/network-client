import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";
import "../styles/AddUser.css";

const AddUser = ({ showModal, setShowModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    role: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}roles`
      );
      setRoles(response.data);
      setSelectedUser({ role: response.data[0].name });
    } catch (error) {
      console.error(error);
    }
  }

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedUser({ ...selectedUser, role: newRole });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (name.length < 3) {
      setError("Name should be at least 3 characters long");
      return;
    }

    if (!email.includes("@") || !email.includes(".com")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }

    try {
      const existingUsers = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}auth/users`
      );

      if (existingUsers.data.some(user => user.email === email)) {
        setError("A user with this email already exists");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}auth/signup`,
        {
          name,
          email,
          password,
          role: selectedUser.role,
        }
      );

      const newUser = response.data.user;
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Form.Control
              as="select"
              value={selectedUser.role}
              onChange={handleRoleChange}
            >
              {roles.map((role) => (
                <option key={role._id} value={role.name} >
                  {role.name}
                </option>
              ))}
            </Form.Control>
            {error && <div className="alert alert-danger">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Add User
            </Button>
          )}

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddUser;
