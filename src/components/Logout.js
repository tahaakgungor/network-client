import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux"
import { useHistory, useLocation } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import Cookies from "js-cookie";
import { saveUser } from "../Redux/UserInformation/userInformationSlice";

function Logout({setIsAuthenticated, isAuthenticated}){
    const [userLog, setUserLog] = useState([]);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const userInfo = useSelector(
      (state) => state.userInformation.userInformation
    );
    const getId = localStorage.getItem("userId");
    const [count, setCount] = useState(0);
    const getTokens = localStorage.getItem("token");
 
  
    useEffect(() => {
      if (getTokens) {
        const intervalId = setInterval(() => {
          setCount(count + 1);
        }, 60000);
    
        return () => {
          clearInterval(intervalId);
        };
      }
      else{
        setCount(0);
      }
    }, [count, getTokens]);
      
    
  
    const status = localStorage.getItem("status");
  
      const fetchUserLog = async () => {
        try {
   
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}logs/user/last/${getId}`,{
            params: {
              $orderby: { createdAt: -1 },
              $limit: 1,
            },
          }
          );
       
          setUserLog(response.data[0]);
        } catch (error) {
          console.error(error);
        }
      };
      useEffect(() => {
        fetchUserLog();
      
        
      }, [userLog]);
      
    useEffect(() => {
  
      const userInfoFromCookie = Cookies.get("userInfo");
      console.log("useEffect", userInfoFromCookie);
      if (userInfoFromCookie) {
        dispatch(saveUser(JSON.parse(userInfoFromCookie)));
      }
    }, [dispatch]);
  
    useEffect(() => {
      
      Cookies.set("userInfo", JSON.stringify(userInfo));
    }, [userInfo]);
  
    
    const handleLogout = async () => {
      try {
        // Kullanıcının son giriş yaptığı tarih ve saat bilgilerini alıyoruz
  
        const lastLoginTime = localStorage.getItem("lastLoginTime");
        console.log(lastLoginTime);
        // Kullanıcının online olduğu süreyi hesaplayıp duration değişkenine atıyoruz
  
        const logoutTime = new Date().toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        console.log(logoutTime);
  
    
    
        // Hesapladığımız bilgileri request body'sindeki objeye ekliyoruz
        const requestBody = {
          status: "logout",
          duration: count,
          logouttime: logoutTime,
  
        };
  
  // Ekle
          const response = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}logs/user/${userLog._id}`,
            requestBody,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          );
          console.log("PUTT", response);
        
    
        // Kullanıcının tarayıcısından tuttuğumuz verileri siliyoruz
        localStorage.removeItem("lastLoginDate");
        localStorage.removeItem("lastLoginTime");
        Cookies.remove("token");
    
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("permission");
        localStorage.removeItem("userRole");
        localStorage.removeItem("cihazlar");
        localStorage.clear();
   
        setIsAuthenticated(false);
      } catch (error) {
        console.error(error);
      }
    };
  

    return (
        <div>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Logout</h1>
                        <p>Are you sure you want to log out?</p>
                        <Button variant="primary" onClick={handleLogout}>
                            Logout
                        </Button>
                        <Link to="/devices" className="btn btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Logout;