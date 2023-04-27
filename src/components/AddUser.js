import React, { useState } from "react";
import { Form, Button, Container, Row, Col} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/AddUser.css";



const AddUser = ({ onAddUser }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(true);
  
    const roleNam = useSelector((state) => state.userInformation.roles);
    const [selectedUser, setSelectedUser] = useState({
      role: roleNam[0].name,
    });
  
    const handleRoleChange = (e) => {
      const newRole = e.target.value;
      setSelectedUser({ ...selectedUser, role: newRole || roleNam[0].name });
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
        const response = await axios.post("http://localhost:5000/auth/signup", {
          name,
          email,
          password,
          role: selectedUser.role,
        });
  
        const newUser = response.data.user;
        onAddUser(newUser);
  
        // Ekleme işlemi başarıyla tamamlandığında formu kapat
        setShowForm(false);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleCancel = () => {
      setShowForm(false);
      onAddUser(null);
    };
  
    return (
      <Container>
        <Row>
          <Col>
            {showForm && (
              <div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                    <div className="role-change">
                    <Form.Group controlId="formBasicRole">
                        <div className="role-label">
                        <Form.Label>Role</Form.Label>
                        </div>
                        <Form.Control

                            as="select"
                            value={selectedUser.role}
                            onChange={handleRoleChange}
                        >
                            {roleNam.map((role) => (
                                <option key={role._id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    </div>
             
                    <div className="button-group">
                    <Button variant="success" type="submit">
                    Submit
                    </Button>
                    <Button variant="danger" onClick={handleCancel}>
                    Cancel
                    </Button>
                    </div>
                </Form>
                {error && <p className="error">{error}</p>}
                </div>
            )}
            </Col>
        </Row>
        </Container>
    );
    };

export default AddUser;

  