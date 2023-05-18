import React, { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function ProfilePage() {
  const [userInfos, setUserInfos] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [logs, setLogs] = useState([]);
  const [logActivity, setLogActivity] = useState('');

  const token = localStorage.getItem('token');

  const decodedToken = jwt_decode(token);
  const userId = decodedToken.userId;

  useEffect(() => {
    fetchUserInfoById();
    fetchLogs();

  }, []);

  const fetchUserInfoById = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}auth/user/${userId}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    setUserInfos(response.data);
    setUserName(response.data.name);
    setUserEmail(response.data.email);
    setUserRole(response.data.role);
  };

  const fetchLogs = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}logs/user/last/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setLogs(response.data);

    setLogActivity(response.data[0].activity);
  };


  return (
    <section style={{ backgroundColor: '#eee', margin: 40 }}>
      <MDBContainer className="py-5">


        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text-muted mb-1">{userName}</p>
                <div className="d-flex justify-content-center mb-2">
                  <Button>Edit</Button>

                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fas icon="globe fa-lg text-warning" />
                    <MDBCardText><a
                      href="https://baykartech.com/"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#333333' }}
                    >
                      baykartech.com
                    </a></MDBCardText>

                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="github fa-lg" style={{ color: '#333333' }} />
                    <MDBCardText></MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="twitter fa-lg" style={{ color: '#55acee' }} />
                    <MDBCardText></MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="instagram fa-lg" style={{ color: '#ac2bac' }} />
                    <MDBCardText></MDBCardText>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="facebook fa-lg" style={{ color: '#3b5998' }} />
                    <MDBCardText></MDBCardText>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userName}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userEmail}</MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Role</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userRole}</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>



            <MDBRow>
              <MDBCol md="12">
                <MDBCard>
                  <MDBCardBody>
                    <h5 className="mb-4">Logs</h5>
                    {logs.map((log, index) => (
                      <p key={index}>{log.activity}</p>
                    ))}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>

          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}

