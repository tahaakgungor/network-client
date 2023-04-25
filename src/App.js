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
} from "react-router-dom";
import { io } from "socket.io-client";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("APPP:",token);
    setIsAuthenticated(token ? true : false);
  }, []);

  useEffect(() => {
    const s = io("ws://localhost:3002");
    s.on("connect", () => {
      console.log("connected");
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
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
  };
  

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Switch>
        <Route exact path="/signup">
          {isAuthenticated ? (
            <Redirect to="/devices" />
          ) : (
            <Signup setIsAuthenticated={setIsAuthenticated} />
          )}
        </Route>
        <Route exact path="/login">
          {isAuthenticated ? (
            <Redirect to="/devices" />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} />
          )}
        </Route>
        <Route exact path="/devices">
          {isAuthenticated ? (
            <>
              <DeviceList />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/devices/command">
          {isAuthenticated ? (
            <CommandPage socket={socket} />
          ) : (
            <Redirect to="/devices" />
          )}
        </Route>
        <Route exact path="/admin">
          {isAuthenticated ? (
            <AdminPanel />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
