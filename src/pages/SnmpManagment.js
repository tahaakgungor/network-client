import React,{useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import SnmpForm from "../components/SnmpForm";
import SnmpTable from "../components/SnmpTable";

function SnmpManagment() {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
    return (
        <div className="container">
       
            <SnmpTable/>
            <br/>
            <SnmpForm/>
            
        </div>
    )
}

export default SnmpManagment