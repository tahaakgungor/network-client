import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

function UserLog() {
    const [userLog, setUserLog] = useState([]);
    const history = useHistory();
    const location = useLocation();

    const user = location.state.user;
    console.log(user._id);
  
    useEffect(() => {
      fetchUserLog();
    }, []);
  
    const fetchUserLog = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}auth/user/log/${user._id}`
        );
        setUserLog(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className="user-log-container">
        <h1>LOGS</h1>
        <table>
          <thead>
            <tr>
              <th>Logged Status</th>
              <th>Logged Date</th>
              <th>Logged Time</th>
            </tr>
          </thead>
          <tbody>
            {userLog.map((log) => (
              <tr key={log._id}>
                <td>{log.loggedStatus}</td>
                <td>{log.loggedDate}</td>
                <td>{log.loggedTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/admin">
          <Button>Back to Admin Panel</Button>
        </Link>
      </div>
    );
  }
  
  export default UserLog;
  