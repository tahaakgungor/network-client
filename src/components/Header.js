import React, {useEffect} from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";


import { saveUser } from "../Redux/UserInformation/userInformationSlice";

const Header = ({ isAuthenticated, handleLogout }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInformation.userInformation);

  useEffect(() => {
    
    const userInfoFromCookie = Cookies.get("userInfo");
    console.log("useEffect",userInfoFromCookie);
    if (userInfoFromCookie) {
      dispatch(saveUser(JSON.parse(userInfoFromCookie)));
    }
  }, [dispatch]);

  useEffect(() => {
    Cookies.set("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);



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

              {(userInfo != null) && userInfo.role == "admin" ? (
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
