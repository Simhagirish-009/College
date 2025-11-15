// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit , FaTrash , FaPlus} from "react-icons/fa";

const ManageSession = () => {
  const [year, setYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState([]);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSession, setEditSession] = useState({
    id: "",
    year : "",
    start_year: "",
    end_year: "",
  });
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // const showModal = () => {
  //   setShow(true);
  // };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addsession/"
        );
        setSession(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setMessage("Error fetching sessions");
        toast.error("Error fetching sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // const handleDelete = async () => {
  //   setLoading(true);
  //   try {
  //     await axios.delete(
  //       `http://localhost:8000/api/addsession/${selectedSessionId}/`
  //     );
  //     setSession(session.filter((s) => s.id !== selectedSessionId));
  //     toast.success("Session Deleted Successfully");
  //     setShowDeleteModal(false); // Close the delete modal
  //   } catch (error) {
  //     console.error("Error deleting session:", error);
  //     setMessage("There are students currently in this session");
  //     toast.error("Error while deleting");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEdit = (session) => {
    setEditSession(session);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8000/api/addsession/${editSession.id}/`,
        {
          year : editSession.year,
          start_year: editSession.start_year,
          end_year: editSession.end_year,
        }
      );
      const updatedSessions = session.map((s) =>
        s.id === editSession.id
          ? {
              ...s,
              year : editSession.year,
              start_year: editSession.start_year,
              end_year: editSession.end_year,
            }
          : s
      );
      setSession(updatedSessions);
      setShowEditModal(false);
      toast.success("Session Edited Successfully");
    } catch (error) {
      console.error("Error updating session:", error);
      setMessage("Error updating session");
      toast.error("Error while editing the session");
    } finally {
      setLoading(false);
    }
  };

  const changeHandle = (e) => {
    const { name, value } = e.target;
    if (name === "year") setYear(value);
    if (name === "start_year") setStartYear(value);
    if (name === "end_year") setEndYear(value);

  };

  // const submitHandle = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/addsession/",
  //       {
  //         year : year,
  //         start_year: startYear,
  //         end_year: endYear,
  //       }
  //     );
  //     setStartYear("");
  //     setEndYear("");
  //     setSession([...session, response.data]);
  //     setShow(false);
  //     toast.success("Session Added successfully");
  //   } catch (error) {
  //     setStartYear("");
  //     setEndYear("");
  //     toast.error("Error while adding session");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const openDeleteModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowDeleteModal(true);
  };

  return (
    <div className="root">
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Manage Sessions</h2>
          <br />
          
          <Card className="mt-3" style={{ width: "100%" }}>
            <Card.Header>
              <Card.Title>Session Years</Card.Title>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <Table
                  bordered
                  striped
                  hover
                  className="animate__animated animate__slideInUp"
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Sno</th>
                      <th>Year</th>
                      <th>Starting Year</th>
                      <th>Ending Year</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.map((session, index) => (
                      <tr key={index} style={{ textAlign: "center" }}>
                        <td>{index + 1}</td>
                        <td>{session.year}</td>
                        <td>{session.start_year}</td>
                        <td>{session.end_year}</td>
                        <td>
                          <Button onClick={() => handleEdit(session)}>
                            <FaEdit /> Edit
                          </Button>
                        </td>
                        {/* <td>
                          <Button
                            variant="danger"
                            onClick={() => openDeleteModal(session.id)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
          {message && <Alert variant="danger">{message}</Alert>}
        </div>
      </div>

      {/* <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandle}>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Select
                name="year"
                value={year}
                onChange={changeHandle}
                required
              >
                <option value="">-- Select Year --</option>
                <option value="1st_Year">1st_Year</option>
                <option value="2nd_Year">2nd_Year</option>
                <option value="3rd_Year">3rd_Year</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Starting Year</Form.Label>
              <Form.Control
                type="date"
                name="start_year"
                value={startYear}
                onChange={changeHandle}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ending Year</Form.Label>
              <Form.Control
                type="date"
                name="end_year"
                value={endYear}
                onChange={changeHandle}
                required
              />
            </Form.Group>
            <br />
            <div className="btnn d-flex justify-content-center">
              <Button className="bttn px-5" type="submit">
                Add Session
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal> */}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Edit Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <p>Year : {editSession.year}</p>
            {/* <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Select
                name="year"
                value={editSession.year}
                onChange={(e) =>
                  setEditSession({
                    ...editSession,
                    year: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Select Year --</option>
                <option value="1st_Year">1st_Year</option>
                <option value="2nd_Year">2nd_Year</option>
                <option value="3rd_Year">3rd_Year</option>
              </Form.Select>
            </Form.Group> */}
            <Form.Group>
              <Form.Label>Starting Year</Form.Label>
              <Form.Control
                type="date"
                value={editSession.start_year}
                onChange={(e) =>
                  setEditSession({
                    ...editSession,
                    start_year: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ending Year</Form.Label>
              <Form.Control
                type="date"
                value={editSession.end_year}
                onChange={(e) =>
                  setEditSession({ ...editSession, end_year: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this session?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default ManageSession;
