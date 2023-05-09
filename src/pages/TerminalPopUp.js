import React, { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import Output from "../components/Output";
import CommandPage from "../pages/CommandPage";
import SnmpForm from "../components/SnmpForm";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "antd";
import { FaTimes, FaPlusSquare } from "react-icons/fa";



function TerminalPopUp() {
localStorage.setItem("lastVisitedPage", window.location.pathname);
  const visitedPage = localStorage.getItem("lastVisitedPage");
  
  const handlePageClose = () => {
    localStorage.setItem("lastVisitedPage", "/devices/command");
  };
  
  useEffect(() => {
    window.onbeforeunload = handlePageClose;
    return () => {
      window.onbeforeunload = null;
    }
  }, []);
  
  return (
    <div>
      <h1>Terminal {visitedPage}</h1>
    </div>
  );
}

export default TerminalPopUp;
