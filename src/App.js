import React, { useState, useEffect } from "react";
import DeviceList from "./pages/DeviceList";
import CommandPage from "./pages/CommandPage";
import Login from "./components/Login";
import Header from "./components/Header";
import AdminPanel from "./pages/AdminPanel";
import TerminalPopUp from "./pages/TerminalPopUp";
import UserLog from "./pages/UserLog";
import SnmpManagment from "./pages/SnmpManagment";
import SnmpInformations from "./pages/SnmpInformations";
import ProfilePage from "./pages/ProfilePage";
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,

} from "react-router-dom";
import { io } from "socket.io-client";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(token ? true : false);
  }, []);

  useEffect(() => {
    const s = io("ws://localhost:5000");
    s.on("connect", () => {
      console.log("connected to socket");
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
  }, []);

  const handlePageChange = () => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          {isAuthenticated ? (
            <Redirect
              to={localStorage.getItem("lastVisitedPage") || "/devices"}
            />
          ) : (
            <>
              <Header setIsAuthenticated={setIsAuthenticated} />

              <Login setIsAuthenticated={setIsAuthenticated} />
            </>
          )}
        </Route>
        <Route exact path="/devices">
          {isAuthenticated ? (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <DeviceList onChange={handlePageChange} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/devices/command">
          {isAuthenticated ? (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <CommandPage socket={socket} onChange={handlePageChange} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        <Route exact path="/snmp">
          {isAuthenticated ? (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <SnmpManagment onChange={handlePageChange} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/snmp/informations">
          {isAuthenticated ? (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <SnmpInformations onChange={handlePageChange} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/admin">
          {isAuthenticated ? (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <AdminPanel onChange={handlePageChange} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/profile">
          {isAuthenticated ? (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <ProfilePage onChange={handlePageChange} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        {/* <Route exact path="/signup">
          {isAuthenticated ? (
            <Redirect to="/devices" />
          ) : (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <Signup
                setIsAuthenticated={setIsAuthenticated}
                onChange={handlePageChange}
              />
            </>
          )}
        </Route> */}
        <Route exact path="/userlog/:userId">
          {isAuthenticated ? (
            <>
              <Header
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
              />
              <UserLog onChange={handlePageChange} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        <Route exact path="/terminal/:id">


          <TerminalPopUp onChange={handlePageChange} />



        </Route>

        <Redirect to="/login" />
      </Switch>
    </Router>

  );
}

export default App;
