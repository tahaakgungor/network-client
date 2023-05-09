import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Output from "../components/Output";
import SnmpForm from "../components/SnmpForm";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "antd";
import { FaTimes, FaPlusSquare } from "react-icons/fa";
import { BsHouseDoorFill, BsInfoCircleFill, BsFillEnvelopeFill, BsFillGearFill, BsFillAspectRatioFill } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CommandPage.css";

function CommandPage({ socket }) {
  const [command, setCommand] = useState("");
  const [commandStates, setCommandStates] = useState({});
  const [output, setOutput] = useState([]);
  const [deviceNames, setDeviceNames] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const location = useLocation();

  localStorage.setItem("output", JSON.stringify(output));
  const storedDevices = localStorage.getItem("cihazlar");
  const devices = storedDevices
    ? JSON.parse(storedDevices)
    : location.state.cihazlar;

    useEffect(() => {
      const storedOutput = JSON.parse(localStorage.getItem("output"));
      if (storedOutput) {
        setOutput(storedOutput);
      }
    }, []);
    
  useEffect(() => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);

    socket.emit("createSSH", devices);

    const initialOutput = devices.map((id) => ({ id, output: "" }));
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

  const handleTabClose = (e, deviceId) => {
    e.stopPropagation();
    setOutput((prevState) => prevState.filter((device) => device.id !== deviceId));
    setActiveTab(null);
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
          className="tabs"
          type= "editable-card"
          items={output.map(({ id, output, input }, index) => ({
            key: index,
            label: deviceNames[index] || id,
            closeable: true,
           

            children: (
              <Output
                output={output}
                socket={socket}
                devices={devices}
                input={input}
                activeTab={activeTab}
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
      {devices.map((deviceId, index) => (
  
        
        <BsFillAspectRatioFill type="primary" onClick={() => handleOpenWindow(deviceId)}>
          Open Window
        </BsFillAspectRatioFill>
      ))}
    </div>
  );
}

export default CommandPage;
