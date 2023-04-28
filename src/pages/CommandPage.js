import React, { useState, useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Output from "../components/Output";
import { Tabs } from "antd";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CommandPage.css";

function CommandPage({ socket }) {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState([]);
  const [deviceNames, setDeviceNames] = useState([]);

  const location = useLocation();
  const devices = location.state.ids;

  useEffect(() => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
  }, []);

  useLayoutEffect(() => {
    socket.emit("createSSH", devices);

    const initialOutput = devices.map((id) => ({ id, output: "" }));
    setOutput(initialOutput);

    const fetchDeviceNames = async () => {
      const names = await Promise.all(
        devices.map(async (id) => {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}devices/selected/${id}`
          );
          return response.data[0].name;
        })
      );
      setDeviceNames(names);
    };

    fetchDeviceNames();

    devices.forEach((deviceId) => {
      console.log("output" + deviceId);
      socket.on("output" + deviceId, (result) => {
        console.log(result);
        setOutput((prevState) =>
          prevState.map((deviceOutput) =>
            deviceOutput.id === deviceId
              ? { ...deviceOutput, output: deviceOutput.output + result }
              : deviceOutput
          )
        );
      });
    });

    return () => {
      devices.forEach((deviceId) => {
        socket.off("output" + deviceId);
      });
    };
  }, [devices, socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      devices.forEach((deviceId) => {
        socket.emit("command", {
          command,
          deviceId,
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setCommand(e.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Command:
          <input type="text" value={command} onChange={handleChange} />
        </label>
        <button className="btn-success" type="submit">
          Submit
        </button>
      </form>
      <Tabs
        className="tabs"
        items={output.map(({ id, output }, index) => ({
          key: index,
          label: deviceNames[index] || id,
          children: <Output output={output} socket={socket} devices={devices}/>,
          
        }))}
        
      />

    </div>
  );
}

export default CommandPage;
