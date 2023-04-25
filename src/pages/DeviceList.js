// DeviceList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DeviceTable from "../components/DeviceTable";
import DeviceForm from "../components/DeviceForm";




function DeviceList() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("http://localhost:5000/devices");
            setDevices(result.data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <DeviceForm setDevices={setDevices} />
            <DeviceTable devices={devices} setDevices={setDevices} />
            
        </div>
    );
}

export default DeviceList;
