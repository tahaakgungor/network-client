import React, { useState, useEffect } from "react";
import { Navbar, Nav, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { saveUser } from "../Redux/UserInformation/userInformationSlice";

const Header = ({ setIsAuthenticated, isAuthenticated }) => {
  const [userLog, setUserLog] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);


  const getTokens = localStorage.getItem("token");
  if (getTokens) {
  }

  const userRole = localStorage.getItem("userRole");

  const userInfo = useSelector(
    (state) => state.userInformation.userInformation
  );

  useEffect(() => {
    if (getTokens) {
      const intervalId = setInterval(() => {
        setCount(count + 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setCount(0);
    }
  }, [count, getTokens]);

  useEffect(() => {
    if (getTokens) {
      const decoded = jwt_decode(getTokens);

      const uid = decoded.userId;

      fetchUserLog(uid);
    }
  }, [userLog, getTokens]);

  const fetchUserLog = async (uid) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}logs/user/last/${uid}`,
        {
          params: {
            $orderby: { createdAt: -1 },
            $limit: 1,
          },
        }
      );
      setUserLog(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };




  const handleLogout = async () => {
    try {
      setLoading(true);
      const lastLoginTime = localStorage.getItem("lastLoginTime");
      console.log(lastLoginTime);

      const logoutTime = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Istanbul",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      console.log(logoutTime);

      const requestBody = {
        status: "logout",
        duration: count,
        logouttime: logoutTime,
      };
      console.log("userLOG", userLog.user);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}logs/user/${userLog._id}`,
        requestBody,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("PUTT", response.data);

      // Kullanıcının tarayıcısından tuttuğumuz verileri siliyoruz
      localStorage.removeItem("lastLoginDate");
      localStorage.removeItem("lastLoginTime");
      Cookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("loggedUser");
      localStorage.removeItem("lastVisitedPage");
      localStorage.removeItem("logs");
      localStorage.removeItem("output");


      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to={isAuthenticated ? "/devices" : "/login"}>
        <img
          alt="baykar"
          style={{ width: 50, height: 50, borderRadius: 10 }}
          src={"https://cdn.baykartech.com/media/images/contents/baykar.png"}
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/devices">
                Devices
              </Nav.Link>
              <Nav.Link as={Link} to="/devices/command">
                Command
              </Nav.Link>
              <Nav.Link as={Link} to="/snmp">
                SNMP
              </Nav.Link>



              {userInfo != null && userRole == "admin" ? (
                <Nav.Link as={Link} to="/admin">
                  Admin
                </Nav.Link>
              ) : null}
            </>
          )}
        </Nav>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : isAuthenticated ? (
          <div className="logout">
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </div>
        ) : (
          <Nav>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/signup">
              Signup
            </Nav.Link> */}
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
