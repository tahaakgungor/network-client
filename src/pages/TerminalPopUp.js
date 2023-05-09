import React, { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import '../styles/TerminalPopUp.css'

function TerminalPopUp() {
  localStorage.setItem("lastVisitedPage", window.location.pathname);

  const location = useLocation();
  const deviceId = location.pathname.split("/")[2]; // Sayfanın adresindeki cihaz ID'sini alın
  let output = localStorage.getItem(`output`);
  if (output) {
    output = JSON.parse(output);
  } else {
    output = [];
  }
  


  
  const handlePageClose = () => {
    localStorage.setItem("lastVisitedPage", "/devices/command");
  };
  
  useEffect(() => {
    window.onbeforeunload = handlePageClose;
    return () => {
      window.onbeforeunload = null;
    }
  }, []);
  
   return (
    <div className="termianl-pop-up">
      <div className="output-of-terminal">
        {output.map((deviceOutput, index) => (
          <div key={index}>
            {deviceOutput.id === deviceId && ( // Eşleşen deviceId'li outputu koşula bağlayarak gösterin
              <pre>{deviceOutput.output}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


export default TerminalPopUp;
