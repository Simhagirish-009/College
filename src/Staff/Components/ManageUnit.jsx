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
import StaffSideNav from "./StaffSideBar";
import Titile from "../../Home/Components/Titile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const ManageUnit = () => {
  const [units, setUnits] = useState([]);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUnit, setEditUnit] = useState({
    id: "",
    unit_field: "",
    co_outcomes: {},
  });
  const [unitField, setUnitField] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [selectedCo, SetselectedCo] = useState({});
  const email = localStorage.getItem("email");
  const [subject, setSubject] = useState("");
  const [session, setSession] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const cleanedEmail = email.replace(/^"|"$/g, "");

        const response = await axios.get(
          `http://localhost:8000/api/addunit/?email=${cleanedEmail}`
        );
        setUnits(response.data || []);
        console.log("CO Outcomes:", response.data[0]?.co_outcomes);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast.error("Error fetching units");
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [email]);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addsession/"
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("Error fetching sessions"); // Show error toast
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchSessions();
  }, [email]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!session) return; // If no session is selected, return
      setLoading(true); // Start loading
      try {
        const cleanedEmail = email.replace(/^"|"$/g, "");
        const response = await axios.get(
          `http://localhost:8000/api/addsub/?session=${session}&email=${cleanedEmail}`
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects"); // Show error toast
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchSubjects();
  }, [session, email]);

  // Function to show delete confirmation modal
  const handleShowDeleteModal = (unitId) => {
    setUnitToDelete(unitId);
    setShowDeleteModal(true);
  };

  // Function to delete the unit
  const handleDelete = async () => {
    if (!unitToDelete) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/addunit/${unitToDelete}/`);
      setUnits(units.filter((unit) => unit.id !== unitToDelete));
      toast.success("Unit Deleted Successfully");
    } catch (error) {
      console.error("Error deleting unit:", error);
      setMessage("Error deleting unit");
      toast.error("Error while deleting unit");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setUnitToDelete(null);
    }
  };
  
  const handleEdit = (unit) => {
    setEditUnit({
      id: unit.id,
      unit_field: unit.unit_field,
      co_outcomes: unit.co_outcomes || {}, // Ensure co_outcomes is properly initialized
    });

    // Set the selected COs with existing marks
    SetselectedCo(unit.co_outcomes || {});

    setShowEditModal(true);
  };

  const handleCheckboxChange = (co) => {
    SetselectedCo((prev) => {
      const updated = { ...prev };
      if (updated.hasOwnProperty(co)) {
        delete updated[co]; // Remove CO if unchecked
      } else {
        updated[co] = ""; // Add CO with empty marks if checked
      }
      return updated;
    });
  };
  const handleEditCheckboxChange = (co) => {
    setEditUnit((prev) => {
      const updatedCOs = { ...prev.co_outcomes };
      if (updatedCOs.hasOwnProperty(co)) {
        delete updatedCOs[co]; // Unchecking CO
      } else {
        updatedCOs[co] = ""; // Checking CO and setting an empty mark field
      }
      return { ...prev, co_outcomes: updatedCOs };
    });
  };

  const handleEditMarksChange = (co, value) => {
    setEditUnit((prev) => ({
      ...prev,
      co_outcomes: { ...prev.co_outcomes, [co]: value },
    }));
  };

  const handleMarksChange = (co, value) => {
    SetselectedCo((prev) => ({
      ...prev,
      [co]: value, // Update marks for selected CO
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/addunit/${editUnit.id}/`, {
        unit_field: editUnit.unit_field,
        Cos: editUnit.co_outcomes, // Fix to update CO outcomes
      });

      const updatedUnits = units.map((unit) =>
        unit.id === editUnit.id
          ? {
              ...unit,
              unit_field: editUnit.unit_field,
              co_outcomes: editUnit.co_outcomes,
            } // Fix update logic
          : unit
      );

      setUnits(updatedUnits);
      setShowEditModal(false);
      toast.success("Unit Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating unit");
    } finally {
      setLoading(false);
    }
  };


  const submitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (Object.keys(selectedCo).length === 0) {
        toast.error("Please select COs for Unit");
        return;
      }

      const response = await axios.post("http://localhost:8000/api/addunit/", {
        unit_field: unitField,
        subject: subject,
        Cos: selectedCo,
      });

      setUnitField("");
      setSession("");
      setSubject("");
      setUnits([...units, response.data]);
      toast.success("Unit Added successfully");
    } catch (error) {
      setUnitField("");
      const errorMessage =
        error.response?.data?.error || "Unit already existed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Manage Units</h2> <br />
          <Card style={{ width: "100%" }}>
            <Card.Header>
              <Modal.Title>Add Unit</Modal.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={submitHandle}>
                <Form.Group>
                  <Form.Label>Unit Exam</Form.Label>
                  <Form.Control
                    type="text"
                    value={unitField}
                    onChange={(e) => setUnitField(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Select Session:</Form.Label>
                  <Form.Select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    required
                  >
                    <option value="">-- Select Session Year --</option>
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Select Subject:</Form.Label>
                  <Form.Select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <br />
                <p>Add COs for unit :</p>
                <Table bordered striped>
                  <thead style={{ textAlign: "center" }}>
                    <tr>
                      <th>CO</th>
                      <th>Select</th>
                      <th>Max Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["CO1", "CO2", "CO3", "CO4", "CO5"].map((co) => (
                      <tr key={co} style={{ textAlign: "center" }}>
                        <td>{co}</td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedCo.hasOwnProperty(co)}
                            onChange={() => handleCheckboxChange(co)}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            min="0"
                            value={selectedCo[co] || ""}
                            onChange={(e) =>
                              handleMarksChange(co, e.target.value)
                            }
                            disabled={!selectedCo.hasOwnProperty(co)}
                            required={selectedCo.hasOwnProperty(co)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <br />
                <div className="btnn d-flex justify-content-center">
                  <Button
                    className="bttn px-5"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      <span>Add Unit</span>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <div className="dash-container mt-3">
            <Card className="mt-3" style={{ width: "100%" }}>
              <Card.Header>
                <Card.Title>Manage Units</Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Table
                    bordered
                    striped
                    hover
                    className="animate__animated animate__slideInUp"
                  >
                    <thead>
                      <tr>
                        <th>Sno</th>
                        <th>Unit Name</th>
                        <th>Subject</th>
                        <th>COs List</th>
                        <th>Edit</th>
                        <th> Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {units.map((unit, index) => (
                        <tr key={unit.id}>
                          <td>{index + 1}</td>
                          <td>Unit: {unit.unit_field}</td>
                          <td>{unit.subject_name}</td>
                          <td>
                            {unit.course_outcomes &&
                            unit.course_outcomes.length > 0 ? (
                              unit.course_outcomes.map((co, coIndex) => (
                                <span key={coIndex}>
                                  {co.co_number} ({co.max_marks} marks)
                                  {coIndex !==
                                    unit.course_outcomes.length - 1 && ", "}
                                </span>
                              ))
                            ) : (
                              <span>No COs</span>
                            )}
                          </td>
                          <td>
                            <Button onClick={() => handleEdit(unit)}>
                              <FaEdit /> Edit
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleShowDeleteModal(unit.id)}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </div>
          {message && (
            <Alert variant="danger">
              <p className="text-danger">{message}</p>
            </Alert>
          )}
        </div>
      </div>

      {/* Add Unit Modal */}

      {/* Edit Unit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Unit Name</Form.Label>
              <Form.Control
                type="text"
                value={editUnit.unit_field}
                onChange={(e) =>
                  setEditUnit({ ...editUnit, unit_field: e.target.value })
                }
                required
              />
            </Form.Group>
            <br />
            <p>Update COs for Unit:</p>
            <Table bordered striped>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>CO</th>
                  <th>Select</th>
                  <th>Max Marks</th>
                </tr>
              </thead>
              <tbody>
                {["CO1", "CO2", "CO3", "CO4", "CO5"].map((co) => (
                  <tr key={co} style={{ textAlign: "center" }}>
                    <td>{co}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={editUnit.co_outcomes.hasOwnProperty(co)}
                        onChange={() => handleEditCheckboxChange(co)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={editUnit.co_outcomes[co]}
                        onChange={(e) =>
                          handleEditMarksChange(co, e.target.value)
                        }
                        disabled={!editUnit.co_outcomes.hasOwnProperty(co)}
                        required={editUnit.co_outcomes.hasOwnProperty(co)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Update"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this unit?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageUnit;
