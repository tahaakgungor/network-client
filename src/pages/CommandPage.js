import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Output from "../components/Output";
import { Tabs } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "antd";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CommandPage.css";

function CommandPage({ socket }) {
  const [commandStates, setCommandStates] = useState({});
  const [output, setOutput] = useState([]);
  const [deviceNames, setDeviceNames] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const location = useLocation();

  const storedDevices = localStorage.getItem("cihazlar");
  const devices = storedDevices ? JSON.parse(storedDevices) : location.state.cihazlar;

  useEffect(() => {
    localStorage.setItem("lastVisitedPage", window.location.pathname);
    
    socket.emit("createSSH", devices);

    const initialOutput = devices.map((id) => ({ id, output: "" }));
    setOutput(initialOutput);

    const initialCommandStates = devices.reduce((acc, deviceId) => ({ ...acc, [deviceId]: "" }), {});
    setCommandStates(initialCommandStates);

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
            
            const handleSubmit = async (e, deviceId) => {
            e.preventDefault();
            try {
            socket.emit("command", {
            command: commandStates[deviceId],
            deviceId,
            });
            } catch (error) {
            console.error(error);
            }
            };
            
            const handleChange = (e, deviceId) => {
            setCommandStates((prevState) => ({
            ...prevState,
            [deviceId]: e.target.value,
            }));
            };
            
            return (
            <div>
            <Tabs
            className="tabs"
            items={output.map(({ id, output, input }, index) => ({
            key: index,
            label: deviceNames[index] || id,
            children: (
            <Output
                       output={output}
                       socket={socket}
                       devices={devices}
                       input={input}
                       activeTab={activeTab}
                     >
            <form onSubmit={(e) => handleSubmit(e, id)}>
            <div className="output-input-button">
            <input
            className="form-control form-control-sm"
            type="text"
            placeholder="Enter command"
            value={commandStates[id]}
            onChange={(e) => handleChange(e, id)}
            />
            <Button type="primary" size="small" htmlType="submit">
            Send
            </Button>
            </div>
            </form>
            </Output>
            ),
            }))}
            />
            </div>
            );
            }
            
            export default CommandPage;
