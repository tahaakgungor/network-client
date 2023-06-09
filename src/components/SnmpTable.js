import React, { useState, useEffect } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

function SnmpTable() {
  const [snmpTable, setSnmpTable] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    fetchSnmpTable();
  }, [snmpTable]);


  const fetchSnmpTable = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}snmp/infos`);
      setSnmpTable(res.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async (id) => {
    setShowDeleteModal(false);
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}snmp/register/${id}`);
      fetchSnmpTable();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id) => {
    setShowEditModal(true);
    const initialInfo = {
      ...snmpTable.find((snmp) => snmp._id === id),
      oid: snmpTable.find((snmp) => snmp._id === id).oid.join(",")
    };

    setUpdatedInfo(initialInfo);
    setShowEditModal(true);
  };

  const handleUpdateRegister = async (e, id) => {
    e.preventDefault();
    setShowEditModal(false);
    setUpdatedInfo({
      ...updatedInfo,
      oid: updatedInfo.oid.split(",")
    });
    console.log(updatedInfo);
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}snmp/${updatedInfo._id}`, updatedInfo);
      fetchSnmpTable();
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedSnmpInfo = async () => {
    try {
      const ids = selectedRows.map((row) => row._id);
      localStorage.setItem("selectedSnmpIds", JSON.stringify(ids));
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}snmp/selected-infos`, { ids, updatedInfo });
      history.push({
        pathname: "/snmp/informations",
        state: { snmpInfo: res.data }
      });

    } catch (error) {
      console.error(error);
    }
  };


  const handleSelectRow = (id) => {
    setSelectedRows((rows) =>
      rows.some((row) => row._id === id)
        ? rows.filter((row) => row._id !== id)
        : [...rows, snmpTable.find((row) => row._id === id)]
    );

  };

  const handleSelectAllRows = (e) => {
    if (e.target.checked) {
      setSelectedRows(snmpTable);
    } else {
      setSelectedRows([]);
    }
  };



  return (
    <div className="container">
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleUpdateRegister}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Host</Form.Label>
              <Form.Control type="text" placeholder="Enter Host" value={updatedInfo.host} onChange={(event) => setUpdatedInfo({ ...updatedInfo, host: event.target.value })} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Community</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Community"
                value={updatedInfo.community}
                onChange={(event) =>
                  setUpdatedInfo({
                    ...updatedInfo,
                    community: event.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Oid</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Oid"
                value={updatedInfo.oid}
                onChange={(event) =>
                  setUpdatedInfo({ ...updatedInfo, oid: event.target.value })
                }
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <table className="table">
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  onChange={handleSelectAllRows}
                  checked={selectedRows.length === snmpTable.length}
                />
              </th>
              <th>Host</th>
              <th>Community</th>
              <th>Oids</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {snmpTable.map((snmp) => (
              <tr key={snmp._id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    onChange={() => handleSelectRow(snmp._id)}
                    checked={selectedRows.some((row) => row._id === snmp._id)}
                  />
                </td>
                <td>{snmp.host}</td>
                <td>{snmp.community}</td>
                <td>{snmp.oid.join(".")}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(snmp._id)}
                  >
                    Edit
                  </Button>
                  <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Delete Device</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this device?</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Close
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(snmp._id)}>
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/snmp/informations">
        <div className="connect-button">

          <Button variant="primary" onClick={() => getSelectedSnmpInfo()}>
            Connect
          </Button>

        </div>
      </Link>

    </div>
  )
}
export default SnmpTable;