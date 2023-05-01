import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const Signup = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      if (token) props.setIsAuthenticated(true);
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            isInvalid={error && name.length < 3}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            isInvalid={error && !email.includes("@")}
          />
          <Form.Control.Feedback type="invalid">
            {error && !email.includes("@") ? error : " "}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            isInvalid={error && password.length < 6}
          />
          <Form.Control.Feedback type="invalid">
            {error && password.length < 6 ? error : " "}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="success" type="submit">
          Submit
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default Signup;
