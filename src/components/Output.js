import React from "react";
import { useLocation } from "react-router-dom";
import '../styles/Output.css'

function Output({output}) {
    const ref = React.useRef(null);
  React.useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
  },[output])

    return (
        <div>
            <div className='output-container'>
                <pre>{output}</pre>
                <div ref={ref}></div>
            </div>
        </div>
    );
    }

export default Output;
