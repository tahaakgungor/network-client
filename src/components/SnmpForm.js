import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

function SnmpForm() {
  const [host, setHost] = useState("");
  const [community, setCommunity] = useState("");
  const [oids, setOids] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const snmpData = {
        host,
        community,
        oids,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}snmp`,
        snmpData
      );
      setShowModal(false);
      setHost("");
      setCommunity("");
      setOids("");


    } catch (error) {
      setIsError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Button className="btn-list" variant="primary" onClick={() => setShowModal(true)}>
        Add SNMP Information
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add SNMP Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formBasicHost">
              <Form.Label>Host</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicCommunity">
              <Form.Label>Community</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter community"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
              />
            </Form.Group>


              <Form.Group controlId="formBasicOid">
                <Form.Label>OIDS</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OID Like 1.3.1.4.1"
                  value={oids}
                  onChange={(e) => setOids(e.target.value)}
                />
              </Form.Group>

            {isError && <div className="alert alert-danger">{errorMessage}</div>}
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SnmpForm;
