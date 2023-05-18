import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../styles/TerminalPopUp.css'

function TerminalPopUp() {
  localStorage.setItem("lastVisitedPage", window.location.pathname);
  const location = useLocation();
  const deviceId = location.pathname.split("/")[2];
  let output = localStorage.getItem(`output`);

  if (output) {
    output = JSON.parse(output);
  } else {
    output = [];
  }

  useEffect(() => {
    window.onbeforeunload = handlePageClose;
    return () => {
      window.onbeforeunload = null;
    }
  }, []);


  const handlePageClose = () => {
    localStorage.setItem("lastVisitedPage", "/devices/command");
  };

  return (
    <div className="termianl-pop-up">
      <div className="output-of-terminal">
        {output.map((deviceOutput, index) => (
          <div key={index}>
            {deviceOutput.id === deviceId && (
              <pre>{deviceOutput.output}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


export default TerminalPopUp;
