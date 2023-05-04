import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

function DeviceForm({ setDevices, onHide }) {
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
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>IP Address</label>
            <input
              type="text"
              className="form-control"
              name="ip"
              value={formData.ip}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="text"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Host</label>
            <input
              type="text"
              className="form-control"
              name="host"
              value={formData.host}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Device Type</label>
            <input
              type="text"
              className="form-control"
              name="device_type"
              value={formData.device_type}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Secret</label>
            <input
              type="text"
              className="form-control"
              name="secret"
              value={formData.secret}
              onChange={handleChange}
            />
          </div>
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
