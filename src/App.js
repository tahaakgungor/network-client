import React, { useState, useEffect } from "react";
import DeviceList from "./pages/DeviceList";
import CommandPage from "./pages/CommandPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import AdminPanel from "./pages/AdminPanel";
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { io } from "socket.io-client";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);
  const history = useHistory();

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

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const handlePageChange = () => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
  };

  return (
    <Router>
      <Header
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
      <Switch>
        <Route exact path="/login">
          {isAuthenticated ? (
            <Redirect to={localStorage.getItem("lastVisitedPage") || "/devices"} />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} />
          )}
        </Route>
        <Route exact path="/devices">
          {isAuthenticated ? (
            <DeviceList onChange={handlePageChange} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/devices/command">
          {isAuthenticated ? (
            <CommandPage socket={socket} onChange={handlePageChange} />
          ) : (
            <Redirect to="/devices" />
          )}
        </Route>
        <Route exact path="/admin">
          {isAuthenticated ? (
            <AdminPanel onChange={handlePageChange} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/signup">
          {isAuthenticated ? (
            <Redirect to="/devices" />
          ) : (
            <Signup setIsAuthenticated={setIsAuthenticated} onChange={handlePageChange} />
          )}
        </Route>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
