import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import '../styles/SnmpInformations.css'

function SnmpInformations() {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
    const [snmpInformations, setSnmpInformations] = useState([]);

    useEffect(() => {
        fetchSelectedSnmpInformations();
    }, [snmpInformations]);

    const fetchSelectedSnmpInformations = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}snmp/all`);
            setSnmpInformations(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log(id);
            const result = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}snmp/${id}`);
            console.log(result);
            fetchSelectedSnmpInformations();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="table-snmp">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>IP</th>
                        <th>Community</th>
                        <th>Value</th>
                        <th>OID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {snmpInformations.map((snmpInformation) => (
                        <tr key={snmpInformation._id}>
                            <td>{snmpInformation.host}</td>
                            <td>{snmpInformation.community}</td>
                            <td>{snmpInformation.value}</td>
                            <td>{snmpInformation.oids.join(", ")}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(snmpInformation._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SnmpInformations;
