import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveUser } from "../Redux/UserInformation/userInformationSlice";

import Cookies from "js-cookie";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if(!email.includes("@") || !email.includes(".com")) {
      setError("Please enter a valid email address");
      return;
    }

    if(password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post("https://network-automation.herokuapp.com/auth/login", { email, password });
      const token = response.data.token;
      Cookies.set("token", token, { expires: 7 }); 
      localStorage.setItem("token", token);
      if(token) {
        console.log("token", token);
        localStorage.setItem("isAuthenticated", true);
        props.setIsAuthenticated(true);
        const res = await axios.post("https://network-automation.herokuapp.com/auth/user", {email}, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log("response of login", res);

       
        const {role} = res.data[0];
        console.log("role", role);

        dispatch(saveUser({email,role}));
      }
      else{
        localStorage.setItem("isAuthenticated", false);
        props.setIsAuthenticated(false);
      }
    } catch (error) {
      if(error.response.status === 400) {
        setError("Email or password is incorrect");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="login">
      <Form onSubmit={handleSubmit}>
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

export default Login;
