import React,{useState} from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";

const AddUser = ({ onAddUser }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        
        if(name.length < 3) {
          setError("Name should be at least 3 characters long");
          return;
        }
    
        if(!email.includes("@") || !email.includes(".com")) {
          setError("Please enter a valid email address");
          return;
        }
    
        if(password.length < 6) {
          setError("Password should be at least 6 characters long");
          return;
        }
    
        try {
            const response = await axios.post("http://localhost:5000/auth/signup", {
              name,
              email,
              password,
            });
          
            const newUser = response.data.user;
            onAddUser(newUser);
            
            const token = response.data.token;
            console.log(token);
            console.log("ress",response);
            localStorage.setItem("token", token);

            // Ekleme işlemi başarıyla tamamlandığında formu kapat
            setShowForm(false);
          } catch (error) {
            console.error(error);
          }
          
      };
    



    return (
        <Container>
            <Row>
                <Col>
                    {showForm && (
                      <Card className="mt-5">
                          <Card.Body>
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
                                  <Button variant="success" type="submit">
                                      Submit
                                  </Button>
                              </Form>
                              {error && <Alert variant="danger">{error}</Alert>}
                          </Card.Body>
                      </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AddUser;
