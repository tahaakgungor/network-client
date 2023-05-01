import React, { useState, useEffect } from "react";
import "../styles/Output.css";
import { Button } from "antd";

function Output({ output, socket, devices, children, activeTab}) {
  const [commandOutput, setCommandOutput] = useState([]);
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [output, commandOutput]);

  const handleCommandSubmit = (e, deviceId) => {
    e.preventDefault();
    try {
      socket.emit("privateCommand", {
        command: commandOutput[deviceId] || "",
        deviceId,
      });
    } catch (error) {
      console.error(error);
    }
    setCommandOutput((prevOutput) => ({ ...prevOutput, [deviceId]: "" }));
  };

  const handleCommandChange = (e, deviceId) => {
    setCommandOutput((prevOutput) => ({
      ...prevOutput,
      [deviceId]: e.target.value,
    }));
  };

  return (
    <div>
      <div className="output-container">
        {output && <pre>{output}</pre>}
        <div ref={ref}></div>
      </div>
      {children}
 
    </div>
  );
}

export default Output;
