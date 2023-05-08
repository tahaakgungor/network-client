import React from "react";
import { useLocation } from "react-router-dom";
import Output from "../components/Output";
import SnmpForm from "../components/SnmpForm";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "antd";
import { FaTimes, FaPlusSquare } from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";


function TerminalPopUp({ setLastVisitedPage }) {
    
    const visitedPage = localStorage.getItem("lastVisitedPage");
  
    const handleClose = () => {
      setLastVisitedPage("/devices/command");
    };
  
    return (
      <div>
        <h1>Terminal {visitedPage}</h1>
        <Button type="primary" onClick={handleClose} icon={<FaTimes />}>
          Close
        </Button>
      </div>
    );
  }

export default TerminalPopUp;
  