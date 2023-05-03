import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/UserLog.css";

function UserLog() {
    const [userLog, setUserLog] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const history = useHistory();
    const location = useLocation();

    const user = location.state.user;


  
    useEffect(() => {
      fetchUserInformation();
      fetchUserLog();
      const intervalId = setInterval(() => {
        fetchUserLog();
      }
      , 1000);
      return () => {
        clearInterval(intervalId);
      };

 
    }, []);
  
    const fetchUserLog = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}logs/user/${user._id}`
        );
        setUserLog(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserInformation = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}auth/user/${user._id}`
        );
        setUserInfo(response.data);
  
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className="user-log-container">
        <br></br>
      
        <h5>User: {userInfo.name}</h5>

        <br></br>
        <table>
          
          <thead>
            <tr>

              <th>Status</th>
              <th>Logged Date</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Duration</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {userLog.map((log) => (
              <tr key={log._id}>
     
                <td>{log.status}</td>
                <td>{log.date}</td>
                <td>{log.logintime}</td>
                <td>{log.logouttime}</td>
                <td>{log.duration} mn</td>
                <td>{log.activity}</td>

              </tr>
            ))}
          </tbody>
        </table>
        <br></br>
        <Link to="/admin">
          <Button variant='primary'>Back to Admin Panel</Button>
        </Link>
      </div>
    );
  }
  
  export default UserLog;
  