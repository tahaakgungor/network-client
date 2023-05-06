import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/DeviceForm.css";

function DeviceForm({ setDevices, onHide }) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    username: "",
    password: "",
    host: "",
    device_type: "",
    secret: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.name === "") {
        setError("Name is required");
        return;
      }
      if (formData.ip === "") {
        setError("IP Address is required");
        return;
      }
      if (formData.username === "") {
        setError("Username is required");
        return;
      }
      if (formData.password === "") {
        setError("Password is required");
        return;
      }
      if (formData.host === "") {
        setError("Host is required");
        return;
      }
      if (formData.device_type === "") {
        setError("Device Type is required");
        return;
      }
      if (formData.secret === "") {
        setError("Secret is required");
        return;
      }
      setError(null);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}devices`,
        formData
      );
      const newDevice = response.data;
      setDevices((devices) => [...devices, newDevice]);
      onHide();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form  onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              placeholder="Enter IP Address"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter Username"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="host"
              value={formData.host}
              onChange={handleChange}
              placeholder="Enter Host"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="device_type"
              value={formData.device_type}
              onChange={handleChange}
              placeholder="Enter Device Type"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="secret"
              value={formData.secret}
              onChange={handleChange}
              placeholder="Enter Secret"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <br></br>
          <div>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default DeviceForm;
