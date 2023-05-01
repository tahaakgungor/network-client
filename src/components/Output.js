import React, { useState } from "react";
import "../styles/Output.css";
import { Button } from "antd";

function Output({ output, socket, devices }) {
  const [command, setCommand] = useState("");
  const [commandOutput, setCommandOutput] = useState([]);

  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [output, commandOutput]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    socket.emit("privateCommand", command);
    setCommandOutput((prevOutput) => [...prevOutput, command]);
    setCommand("");
  };

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  return (
    <div>
      <div className="output-container">
        {output && <pre>{output}</pre>}
        {commandOutput.map((cmdOutput, index) => (
          <pre key={index}>{cmdOutput}</pre>
        ))}
        <div ref={ref}></div>
      </div>
      <form onSubmit={handleCommandSubmit}>
        <div className="output-input-button">
          <input
            className="form-control form-control-sm"
            type="text"
            placeholder="Enter command"
            value={command}
            onChange={handleCommandChange}
          />
          <Button type="primary" size="small" htmlType="submit">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Output;
