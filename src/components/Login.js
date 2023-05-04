import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveUser } from "../Redux/UserInformation/userInformationSlice";

import Cookies from "js-cookie";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedDate, setLoggedDate] = useState("");
  const [loggedTime, setLoggedTime] = useState("");

  const dispatch = useDispatch();

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

    const localDate = localStorage.setItem("lastLoginDate", date);
    const localTime = localStorage.setItem("lastLoginTime", time);

    setLoggedDate(date);
    setLoggedTime(time);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.includes("@") || !email.includes(".com")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
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
      Cookies.set("token", token, { expires: 7 });
      localStorage.setItem("token", token);

      if (token) {
        console.log("token", token);
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

        console.log("response of login", res.data[0]._id);

        const userId = res.data[0]._id;
        const localId = localStorage.setItem("userId", userId);
        const getId = localStorage.getItem("userId");
        console.log("GETT:",getId);


        const { role } = res.data[0];

        console.log("role", role);

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
      } else {
        localStorage.setItem("isAuthenticated", false);
        props.setIsAuthenticated(false);
      }
    } catch (error) {
      if (error.response.status === 400) {
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
