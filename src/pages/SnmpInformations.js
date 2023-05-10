import React,{useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import SnmpForm from "../components/SnmpForm";
import SnmpTable from "../components/SnmpTable";

function SnmpInformations(){
    localStorage.setItem("lastVisitedPage", window.location.pathname);
    const location = useLocation();
    return (
        <div className="container">
       
            <pre>
                <code>
                    <h1>SNMP Informations</h1>
                    </code>
            </pre>
            
        </div>
    )
}

export default SnmpInformations