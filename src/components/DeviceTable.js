import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addConnectedDevice, removeConnectedDevice } from "../Redux/Device/deviceSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DeviceTable.css";

function DeviceTable({ devices, setDevices, socket }) {
  const history = useHistory();
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [filter, setFilter] = useState("");
  const [role, setRole] = useState([]);
  const [selections , setSelections] = useState([]);


  const userInfo = useSelector((state) => state.userInformation.userInformation.role);


  useEffect(() => {
    
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}roles`);
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

    console.log("SELECTIONS:", cihazlar);

    localStorage.setItem("cihazlar", JSON.stringify(cihazlar));

    history.push({
      pathname: "/devices/command",
      state: { cihazlar: cihazlar },
    });
    console.log("SELECTTT:", cihazlar.length);
  };

  

  const deviceIds = userInfo === "admin"
  ? devices.map(device => device)
  : role.find(role => role.name === userInfo)?.devices ?? [];






    


 
  

  return (
    <div className="contain">
      <div className="filter">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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
};

export default DeviceTable;

