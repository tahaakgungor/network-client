import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { saveNewRole, deleteRole } from "../Redux/UserInformation/userInformationSlice";
import { useDispatch, useSelector } from "react-redux";

function RoleManagement() {
  const [devices, setDevices] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);

  const dispatch = useDispatch();
  const roles = useSelector((state) => state.userInformation.roles);

  useEffect(() => {
    async function fetchData() {
      try {
        const deviceResponse = await axios.get("http://localhost:5000/devices");
        setDevices(deviceResponse.data);
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
      const response = await axios.post(`http://localhost:5000/roles`, roleData);
      dispatch(saveNewRole(response.data));
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
        dispatch(deleteRole(roleId));
      await axios.delete(`http://localhost:5000/roles/${roleId}`);
     
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Role Management</h1>
      <Row>
      <Col>
  <Card className="mb-4">
    <Card.Body>
      <Form onSubmit={handleRoleSubmit}>
        <Form.Group controlId="formRoleName">
          <Form.Label>Role Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDeviceList">
          <Form.Label>Devices:</Form.Label>
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
        <Button variant="primary" type="submit">
          Add Role
        </Button>
      </Form>
    </Card.Body>
  </Card>
</Col>
<Col>
  <h2 className="mt-4 mb-4">Roles</h2>
  {roles.map((role) => (
    <Card key={role._id} className="mb-4">
      <Card.Body>
        <h3>{role.name}</h3>
        <ul>
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
</Col>


        </Row>
    </Container>
    );
}

export default RoleManagement;