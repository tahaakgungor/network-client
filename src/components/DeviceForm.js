import React, { useState } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DeviceForm.css";

function DeviceForm({ setDevices }) {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");
  const [device_type, setDevice_type] = useState("");
  const [secret, setSecret] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const device = {
      name,
      ip,
      username,
      password,
      host,
      device_type,
      secret,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}devices`,
      device
    );
    setDevices((devices) => [...devices, response.data]);

    setName("");
    setIp("");
    setUsername("");
    setPassword("");
    setHost("");
    setDevice_type("");
    setSecret("");
  };

  return (
    <div className="device-form">
      <form onSubmit={handleSubmit}>
        <h2 className="header-two">Add Device</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          IP Address:
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Host:
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        </label>
        <label>
          Device Type:
          <input
            type="text"
            value={device_type}
            onChange={(e) => setDevice_type(e.target.value)}
          />
        </label>
        <label>
          Secret:
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
        </label>
        <div>
          <button className="btn btn-success">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default DeviceForm;
