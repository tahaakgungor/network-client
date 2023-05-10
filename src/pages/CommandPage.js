import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Output from "../components/Output";
import SnmpForm from "../components/SnmpForm";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "antd";
import { FaTimes, FaPlusSquare, FaWindowMaximize } from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CommandPage.css";

function CommandPage({ socket }) {
  const [command, setCommand] = useState("");

  
  const [output, setOutput] = useState(() => {
    const storedOutput = localStorage.getItem("output");
    return storedOutput ? JSON.parse(storedOutput) : [];
  });
  const [deviceNames, setDeviceNames] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const location = useLocation()
  const storedDevices = localStorage.getItem("cihazlar");
  const [devices, setDevices] = useState(storedDevices
    ? JSON.parse(storedDevices)
    : location.state.cihazlar);
    const [commandStates, setCommandStates] = useState(devices.reduce(
      (acc, deviceId) => ({ ...acc, [deviceId]: "" }),
      {}
    ));
;

  useEffect(() => {
    localStorage.setItem("output", JSON.stringify(output));
  }, [output]);

 

  useEffect(() => {
    const storedOutput = JSON.parse(localStorage.getItem("output"));
    if (storedOutput) {
      setOutput(storedOutput);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);

    socket.emit("createSSH", devices);

    const storedOutput = JSON.parse(localStorage.getItem("output"));
    const initialOutput = devices.map((id) => ({
      id,
      output: storedOutput?.find((o) => o.id === id)?.output || "",
    }));
    console.log(initialOutput);
    setOutput(initialOutput);

    const initialCommandStates = devices.reduce(
      (acc, deviceId) => ({ ...acc, [deviceId]: "" }),
      {}
    );
    setCommandStates(initialCommandStates);

    devices.forEach((deviceId) => {
      console.log("output" + deviceId);
      socket.on("output" + deviceId, (result) => {
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
  }, [socket]);


  useEffect(() => {
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
  }, [devices]);

  const handleOpenWindow = (deviceId) => {
    const url = `http://localhost:3000/terminal/${deviceId}`;
    window.open(url, "_blank", "width=800,height=600");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      devices.forEach((deviceId) => {
        socket.emit("command", {
          command: command,
          deviceId: deviceId,
        });
      });
      setCommand("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setCommand(e.target.value);
  };

  const handleOtherChange = (e, deviceId) => {
    setCommandStates((prevState) => ({
      ...prevState,
      [deviceId]: e.target.value,
    }));
  };

  const handleOtherSubmit = async (e, deviceId) => {
    e.preventDefault();
    try {
      socket.emit("privateCommand", {
        command: commandStates[deviceId],
        devices: deviceId,
      });
      setCommandStates((prevState) => ({
        ...prevState,
        [deviceId]: "",
      }));
    } catch (error) {
      console.error(error);
    }
    setCommandStates((prevOutput) => ({ ...prevOutput, [deviceId]: "" }));
  };

  const handleTabClose = (targetKey) => {
    const deviceId = output[targetKey].id;
    socket.emit("disconnectSSH", deviceId);
    setOutput((prevState) =>
      prevState.filter((_, index) => index !== targetKey)
    );
    setDeviceNames((prevState) =>
      prevState.filter((_, index) => index !== targetKey)
    );

    const newDevices = devices.filter((_, index) => index !== targetKey);
    setDevices(newDevices);
  
    localStorage.setItem("output", JSON.stringify(output));
    localStorage.setItem("cihazlar", JSON.stringify(newDevices));

    

  };

  return (
    <div className="command-page">
      <form className="all-command" onSubmit={(e) => handleSubmit(e)}>
        <h5 className="command-title">Command To All Devices</h5>

        <input
          className="form-control form-control-sm"
          type="text"
          placeholder="Enter command"
          value={command}
          onChange={(e) => handleChange(e)}
        />
        <Button type="primary" htmlType="submit">
          Send
        </Button>
      </form>

      <div>
        <Tabs
          hideAdd
          className="tabs"
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === "remove") {
              handleTabClose(targetKey);
            }
          }}

          items={output.map(({ id, output}, index) => ({
            key: index,
            label: (<div className="tab-label-wrapper">
              <span className="device-name">{deviceNames[index]}</span>
              <span
                className="maximize-icon"
                onClick={() => {
                  handleOpenWindow(id);
                }}
              >
                <FaWindowMaximize />
              </span>
            </div>),
            closeable: true,
            children: (
              <Output
                output={output}
              >
                <form
                  className="terminal"
                  onSubmit={(e) => handleOtherSubmit(e, id)}
                >
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Enter command"
                    value={commandStates[id]}
                    onChange={(e) => handleOtherChange(e, id)}
                  />

                  <Button type="primary" htmlType="submit">
                    Send
                  </Button>
                </form>
              </Output>
            ),
          }))}
        />
      </div>

    </div>
  );
}

export default CommandPage;
