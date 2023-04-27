import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "../styles/AddRole.css"

function RoleManagement() {
  const [devices, setDevices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const deviceResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}devices`);
        setDevices(deviceResponse.data);
        const roleResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}roles`);
        setRoles(roleResponse.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    const roleData = {
      name: roleName,
      devices: selectedDevices,
    };
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}roles`, roleData);
      setRoles([...roles, response.data]);
      setRoleName("");
      setSelectedDevices([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeviceSelection = (deviceId) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter((id) => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };
  
  const handleRoleDelete = async (roleId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}roles/${roleId}`);
      setRoles(roles.filter((role) => role._id !== roleId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
      <Col>

    <Card.Body>
      <Form onSubmit={handleRoleSubmit}>
        <Form.Group className="form-input-role" controlId="formRoleName">
          <Form.Label>Role Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="formDevList" >
          <Form.Label> Devices:</Form.Label>
          {devices.map((device) => (
            <div key={device._id} className="mb-2">
              <Form.Check 
                type="checkbox"
                label={device.name}
                checked={selectedDevices.includes(device._id)}
                onChange={() => handleDeviceSelection(device._id)}
              />
            </div>
          ))}
        </Form.Group>
        <Button variant="success" type="submit">
          Add Role
        </Button>
      </Form>
    </Card.Body>
</Col>
<Col>
<Card.Body>
  <Form.Group className="form-input-roles" controlId="formRoleName">

    {roles.map((role) => (
      <Card key={role._id} className="mb-4">
        <Card.Body>
          <h3>{role.name}</h3>
          <ul className="card-2-ul">
            {devices
              .filter((device) => role.devices.includes(device._id))
              .map((device) => (
                <li key={device._id}>{device.name}</li>
              ))}
          </ul>
          <Button variant="danger" onClick={() => handleRoleDelete(role._id)}>
Delete
</Button>
</Card.Body>
</Card>
))}

</Form.Group>
</Card.Body>

</Col>
        </Row>
    </Container>
  );
}
export default RoleManagement;
