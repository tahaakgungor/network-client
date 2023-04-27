import React, { useState, useLayoutEffect } from "react";
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

  useLayoutEffect(() => {
    socket.emit("createSSH", devices);

    // Create an empty array to store output for each device
    const initialOutput = devices.map((id) => ({ id, output: "" }));
    setOutput(initialOutput);
    console.log("asdasd",initialOutput)

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
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let i = 0; i < devices.length; i++) {
        const deviceId = devices[i];
        console.log("forr",deviceId);
        socket.on("output" + deviceId, (result) => {
          console.log("output" + deviceId);
          const index = output.findIndex((item) => item.id === deviceId);
          console.log(index+"index");
          const updatedOutput  = [...output];
          console.log(updatedOutput);
          updatedOutput[index].output += result;
          setOutput(updatedOutput);
        });

        socket.emit("command", {
          command,
          deviceId: deviceId,
        });
      }
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
          children: <Output output={output} />,
        }))}
      />
    </div>
  );
}

export default CommandPage;
