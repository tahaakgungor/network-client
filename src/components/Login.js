import React, { useEffect, useState, } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveUser } from "../Redux/UserInformation/userInformationSlice";
import '../styles/Login.css'
import jwt_decode from "jwt-decode";

import Cookies from "js-cookie";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedDate, setLoggedDate] = useState("");
  const [loggedTime, setLoggedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();


  useEffect(() => {
    const date = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const time = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Istanbul",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    localStorage.setItem("lastLoginDate", date);
    localStorage.setItem("lastLoginTime", time);

    setLoggedDate(date);
    setLoggedTime(time);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!email.includes("@") || !email.includes(".com")) {
      setLoading(false);
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      setError("Password should be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}auth/login`,
        { email, password },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      console.log("token: ", token);
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      Cookies.set("token", token, { expires: 7 });
      localStorage.setItem("token", token);

      if (token) {
        localStorage.setItem("isAuthenticated", true);
        props.setIsAuthenticated(true);

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}auth/user`,
          { email },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userRole = res.data[0].role;

        localStorage.setItem("userRole", userRole);

        const { role } = res.data[0];

        dispatch(saveUser({ userId, email, role }));

        console.log("date", loggedDate);
        console.log("time", loggedTime);

        const userLogPost = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}logs/user/${userId}`,
          {
            user: userId,
            date: loggedDate,
            logintime: loggedTime,
            logouttime: "",
            status: "login",
            duration: "",
            activity: "",
            notes: "",
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("userLogPost", userLogPost.data);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}roles/user/${userRole}`
        );
        if (response.data[0] === undefined) {
          return;
        }
        setPermission(response.data[0].permissions);
        localStorage.setItem("permission", response.data[0].permissions);
        history.push("/devices", { permission: response.data[0].permissions });

      } else {
        localStorage.setItem("isAuthenticated", false);
        props.setIsAuthenticated(false);
        setError("Email or password is incorrect");
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setError("Email or password is incorrect");
        setLoading(false);
      } else {
        console.error(error);
        setError("Something went wrong. Please try again later.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="login">
      <Form className="login-form" onSubmit={handleSubmit}>
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
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <Button variant="success" type="submit">
            Submit
          </Button>
        )}
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
