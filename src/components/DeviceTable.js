import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  addConnectedDevice,
  removeConnectedDevice,
} from "../Redux/Device/deviceSlice";
import CryptoJS from "crypto-js";
import { saveUser } from "../Redux/UserInformation/userInformationSlice";
import jwt_decode from "jwt-decode";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DeviceTable.css";

function DeviceTable({ devices, setDevices, socket }) {
  const history = useHistory();
  const [userLog, setUserLog] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [filter, setFilter] = useState("");
  const [role, setRole] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);

  const dispatch = useDispatch();

  const secretKey = "my-secret-key@123tT!";
  const userInfo = useSelector(
    (state) => state.userInformation.userInformation
  );

  const getTokens = localStorage.getItem("token");


  const userRole = localStorage.getItem("userRole");

  const time = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Istanbul",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const fetchUserLog = async (uid) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}logs/user/last/${uid}`,
        {
          params: {
            $orderby: { createdAt: -1 },
            $limit: 1,
            userId: uid,
          },
        }
      );
      console.log("response", response.data);
      setUserLog(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(getTokens){
      const decoded = jwt_decode(getTokens);
      const uid = decoded.userId;
    fetchUserLog(uid);
    }
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}roles`
        );
        setRole(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, []);

  const handleSelect = (id) => {
    if (selectedDevices.includes(id)) {
      setSelectedDevices(selectedDevices.filter((deviceId) => deviceId !== id));
    } else {
      setSelectedDevices([...selectedDevices, id]);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDevices(devices.map((device) => device._id));
    } else {
      setSelectedDevices([]);
    }
  };

  const handleUpdate = (device) => {
    setEditingDevice(device);
    setFormData(device);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("FORMDATA:", formData);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}devices/${editingDevice._id}`,
        formData
      );

      const updatedDevice = response.data;
      setDevices(
        devices.map((device) =>
          device._id === updatedDevice._id ? updatedDevice : device
        )
      );
      setEditingDevice(null);
      setFormData({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingDevice(null);
    setFormData({});
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}devices/${id}`);
      setDevices(devices.filter((device) => device._id !== id));
      setSelectedDevices(selectedDevices.filter((deviceId) => deviceId !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const connectDevices = async (cihazlar = selectedDevices) => {
    if (cihazlar.length === 0) {
      console.log("Please select at least one device.");
      alert("Please select at least one device.");
      return;
    }

    try {
      // Get information of all selected devices

      const deviceResArray = await Promise.all(
        cihazlar.map(async (deviceId) => {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}devices/selected/${deviceId}`
          );
          return response.data[0];
        })
      );
      console.log("DEVICE RES:", deviceResArray);

      // Construct activity string
      const activityString =
        deviceResArray
          .map((device) => `${device.name}/${device.ip}`)
          .join(", ") + ` are edited at ${time}.`;

      const currentLogs = JSON.parse(localStorage.getItem("logs")) ?? [];
      const newLogs = [...currentLogs, activityString];

      // Save the new logs to localStorage
      localStorage.setItem("logs", JSON.stringify(newLogs));

      console.log("CONNECTED DEVICES:", connectDevices);

      console.log("GET User Id", newLogs);
      // Send log request
      const requestBody = {
        activity: newLogs,
      };
      console.log(newLogs);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}logs/user/${userLog._id}`,
        requestBody,
        {}
      );
      console.log("RESPONSE:", response);
    } catch (error) {
      console.error(error);
    }

    localStorage.setItem("cihazlar", JSON.stringify(cihazlar));

    history.push({
      pathname: "/devices/command",
      state: { cihazlar: cihazlar },
    });
  };

  const deviceIds =
    userRole === "admin"
      ? filteredDevices.length > 0
        ? filteredDevices.map((device) => device)
        : devices.map((device) => device)
      : role.find((role) => role.name === userRole)?.devices ?? [];

  const filterSearch = (e) => {
    setFilter(e.target.value);

    const filt = devices.filter((device) => {
      return (
        device.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        device.ip.toLowerCase().includes(e.target.value.toLowerCase()) ||
        device.username.toLowerCase().includes(e.target.value.toLowerCase()) ||
        device.password.toLowerCase().includes(e.target.value.toLowerCase()) ||
        device.host.toLowerCase().includes(e.target.value.toLowerCase()) ||
        device.device_type
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        device.secret.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setFilteredDevices(filt);
  };

  return (
    <div className="contain">
      <div className="filter">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={filter}
          onChange={filterSearch}
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedDevices.length === devices.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>IP Address</th>
              <th>Username</th>
              <th>Password</th>
              <th>Host</th>
              <th>Device Type</th>
              <th>Secret</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deviceIds.map((device) => {
              return (
                <tr key={device._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedDevices.includes(device._id)}
                      onChange={() => handleSelect(device._id)}
                    />
                  </td>
                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      device.name
                    )}
                  </td>

                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <input
                        type="text"
                        name="ip"
                        value={formData.ip}
                        onChange={handleChange}
                      />
                    ) : (
                      device.ip
                    )}
                  </td>
                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    ) : (
                      device.username
                    )}
                  </td>
                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    ) : (
                      device.password
                    )}
                  </td>
                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <input
                        type="text"
                        name="host"
                        value={formData.host}
                        onChange={handleChange}
                      />
                    ) : (
                      device.host
                    )}
                  </td>
                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <input
                        type="text"
                        name="device_type"
                        value={formData.device_type}
                        onChange={handleChange}
                      />
                    ) : (
                      device.device_type
                    )}
                  </td>
                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <input
                        type="text"
                        name="secret"
                        value={formData.secret}
                        onChange={handleChange}
                      />
                    ) : (
                      device.secret
                    )}
                  </td>
                  <td>
                    {editingDevice && editingDevice._id === device._id ? (
                      <div>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                          >
                            Save
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </td>
                      </div>
                    ) : (
                      <div>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpdate(device)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(device._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="buttons">
        <button
          className="btn btn-primary"
          onClick={() => connectDevices(selectedDevices)}
        >
          Connect
        </button>
      </div>
    </div>
  );
}

export default DeviceTable;
