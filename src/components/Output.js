import React, { useState, useEffect } from "react";
import "../styles/Output.css";
import { Button } from "antd";

function Output({ output, children }) {
  const [commandOutput, setCommandOutput] = useState([]);
  const ref = React.useRef(null);



  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [output, commandOutput]);

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
