import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import { saveUser } from "../Redux/UserInformation/userInformationSlice";

const Header = ({ setIsAuthenticated, isAuthenticated }) => {
  const [userLog, setUserLog] = useState([]);
  const [count, setCount] = useState(0);

  const getId = localStorage.getItem("userId");
  const getTokens = localStorage.getItem("token");

  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state) => state.userInformation.userInformation
  );
  console.log(count);
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
      fetchUserLog();
    }
  }, [userLog, getTokens]);

  useEffect(() => {
    const userInfoFromCookie = Cookies.get("userInfo");
    if (userInfoFromCookie) {
      dispatch(saveUser(JSON.parse(userInfoFromCookie)));
    }
  }, [dispatch]);

  useEffect(() => {
    Cookies.set("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  const fetchUserLog = async () => {
    try {
      localStorage.getItem("userId")
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}logs/user/last/${getId}`,
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
      console.log("userLOG" , userLog.user)
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

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("loggedUser");
      localStorage.removeItem("lastVisitedPage");
      localStorage.removeItem("logs")

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

              {userInfo != null && userInfo.role == "admin" ? (
                <Nav.Link as={Link} to="/admin">
                  Admin
                </Nav.Link>
              ) : null}
            </>
          )}
        </Nav>
        {isAuthenticated ? (
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
