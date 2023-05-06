import React, { useState, useEffect } from "react";
import axios from "axios";
import DeviceTable from "../components/DeviceTable";
import DeviceForm from "../components/DeviceForm";
import SnmpForm from "../components/SnmpForm";
import "../styles/DeviceList.css"
import { Button } from "react-bootstrap";

function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [showDeviceForm, setShowDeviceForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}devices`
      );
      setDevices(result.data);
    };
    fetchData();
  }, []);

  const handleShowDeviceForm = () => {
    setShowDeviceForm(true);
  };

  const handleHideDeviceForm = () => {
    setShowDeviceForm(false);
  };

  return (
    <div>

      {showDeviceForm && <DeviceForm setDevices={setDevices} onHide={handleHideDeviceForm} />}
      <DeviceTable devices={devices} setDevices={setDevices} />
      <Button className="btn-list" variant="primary" onClick={handleShowDeviceForm}>
        Add New Device
      </Button>
      <br />
      <br />
      <SnmpForm />

    </div>
  );
}

export default DeviceList;
