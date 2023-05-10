import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import "../styles/AddRole.css";

function RoleManagement() {
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    async function fetchData() {
      try {
        const deviceResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}devices`
        );
        const roleResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}roles`
        );

        if (deviceResponse.data && roleResponse.data) {
          setDevices(deviceResponse.data);
          setRoles(roleResponse.data);

        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);



  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const roleData = {
      name: roleName,
      devices: selectedDevices,
    };
    try {
      if (roleName.length < 3) {
        setError("Role name should be at least 3 characters long");
        return;
      }
      if (selectedDevices.length === 0) {
        setError("Please select at least one device");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}roles`,
        roleData
      );
      const updatedRole = { ...response.data, devices: devices.filter(d => selectedDevices.includes(d._id)) };
setRoles([...roles, updatedRole]);

      setRoleName("");
      setSelectedDevices([]);
      console.log(response.data);
    
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }

  };

  const handleDeviceSelection = (deviceId) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter((id) => id !== deviceId));
      console.log("if", selectedDevices);
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
      console.log("else", selectedDevices);
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
            <Form className="form-role" onSubmit={handleRoleSubmit}>
              <Form.Group className="form-input-role">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </Form.Group>
              <Form.Label>Devices</Form.Label>
              <Form.Group className="formDevList">
 
                {devices.map((device) => (
                  <div className="mb-2" key={device._id}>
                    <Form.Check
                      type="checkbox"
                      label={device.name}
                      checked={selectedDevices.includes(device._id)}
                      onChange={() => handleDeviceSelection(device._id)}
                    />
                  </div>
                ))}
              </Form.Group>

              <br/> 
              {loading ? (
  <Spinner animation="border" variant="primary" />
) : error && <div className="alert alert-danger">{error}</div>}
              <Button variant="success" type="submit">
                Add Role
              </Button>
            </Form>
          </Card.Body>
        </Col>
        <Col>
          <Card.Body>
            <Form.Group className="form-input-roles">
              {roles.map((role) => (
                <Card key={role._id} className="mb-4">
                  <Card.Body>
                    <ul className="list-group">
                      <h3>{role.name}</h3>
                      <br></br>
                      {role.devices.map((device) => (
                        <li className="list-group-item" key={device._id}>
                          {device.name}
                        </li>
                      ))}
                      <br></br>

                      <Button
                        variant="danger"
                        onClick={() => handleRoleDelete(role._id)}
                      >
                        Delete
                      </Button>
                    </ul>
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
