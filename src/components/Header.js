import React, {useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import { saveUser } from "../Redux/UserInformation/userInformationSlice";

const Header = ({setIsAuthenticated ,isAuthenticated }) => {
  const [userLog, setUserLog] = useState([]);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const userInfo = useSelector(
    (state) => state.userInformation.userInformation
  );
  const getId = localStorage.getItem("userId");
  const [count, setCount] = useState(0);
  const getTokens = localStorage.getItem("token");


  useEffect(() => {
    if (getTokens) {
     
      const intervalId = setInterval(() => {
        setCount(count + 1);
      }, 60000);
  
      return () => {
        clearInterval(intervalId);
      };
    }
    else{
      setCount(0);
    }
  }, [count, getTokens]);
    
  

  const status = localStorage.getItem("status");

    const fetchUserLog = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}logs/user/last/${getId}`,{
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
    useEffect(() => {
      fetchUserLog();
      
      
    }, [userLog]);
    
  useEffect(() => {

    const userInfoFromCookie = Cookies.get("userInfo");
    console.log("useEffect", userInfoFromCookie);
    if (userInfoFromCookie) {
      dispatch(saveUser(JSON.parse(userInfoFromCookie)));
    }
  }, [dispatch]);

  useEffect(() => {
    
    Cookies.set("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  
  const handleLogout = async () => {
    try {
      // Kullanıcının son giriş yaptığı tarih ve saat bilgilerini alıyoruz

      const lastLoginTime = localStorage.getItem("lastLoginTime");
      console.log(lastLoginTime);
      // Kullanıcının online olduğu süreyi hesaplayıp duration değişkenine atıyoruz

      const logoutTime = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Istanbul",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      console.log(logoutTime);

  
  
      // Hesapladığımız bilgileri request body'sindeki objeye ekliyoruz
      const requestBody = {
        status: "logout",
        duration: count,
        logouttime: logoutTime,

      };

// Ekle
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}logs/user/${userLog._id}`,
          requestBody,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        console.log("PUTT", response);
      
  
      // Kullanıcının tarayıcısından tuttuğumuz verileri siliyoruz
      localStorage.removeItem("lastLoginDate");
      localStorage.removeItem("lastLoginTime");
      Cookies.remove("token");
  
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("loggedUser");
 
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
