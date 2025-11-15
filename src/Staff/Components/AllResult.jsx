// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import StaffSideNav from "./StaffSideBar";
import Titile from "../../Home/Components/Titile";
import { Table, Spinner, Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
const AllResult = () => {
  const [results, setResults] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [session, setSession] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const email = JSON.parse(localStorage.getItem("email")).replace(/^"|"$/g, "");

  useEffect(() => {
    // Fetch sessions
    axios
      .get("http://localhost:8000/api/addsession/")
      .then((response) => setSessions(response.data))
      .catch(() => toast.error("Error fetching sessions"));
  }, []);

  useEffect(() => {
    if (!session) return;
    // Fetch subjects
    axios
      .get("http://localhost:8000/api/addsub/", { params: { session, email } })
      .then((response) => setSubjects(response.data))
      .catch(() => toast.error("Error fetching subjects"));
  }, [session, email]);

  useEffect(() => {
    if (!unit) return;
    setLoading(true);
    // Fetch results
    axios
      .get(`http://localhost:8000/api/result_stu/`, {
        params: { email, session, unit, subject },
      })
      .then((response) => setResults(response.data))
      .catch(() => toast.error("Error fetching results"))
      .finally(() => setLoading(false));
  }, [session, subject, unit, email]);

  useEffect(() => {
    if (!subject) return;
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/addunit/?subject=${subject}`
        );
        setUnits(res.data || []);
      } catch (error) {
        toast.error("Error fetching units");
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [subject]);

  const handleEditClick = (result) => {
    setSelectedResult({ ...result, co_marks: [...result.co_marks] });
    setShowModal(true);
  };

  const handleCoMarksChange = (index, value) => {
    setSelectedResult((prevResult) => {
      const updatedCoMarks = [...prevResult.co_marks];
      const maxValue = updatedCoMarks[index].max_marks;

      // Ensure the entered value does not exceed max_marks
      const newValue = Math.min(Number(value), maxValue);
      updatedCoMarks[index].total_marks = newValue;

      // Calculate the sum of all co_marks
      const totalExamMarks = updatedCoMarks.reduce(
        (sum, co) => sum + Number(co.total_marks || 0),
        0
      );

      return { ...prevResult, co_marks: updatedCoMarks, exam: totalExamMarks };
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/edit_result/${selectedResult.id}/`,
        {
          exam: selectedResult.exam,
          co_marks: selectedResult.co_marks.map((co) => ({
            id: co.id,
            total_marks: co.total_marks,
          })),
        }
      );
      toast.success("Result updated successfully");

      setResults((prevResults) =>
        prevResults.map((result) =>
          result.id === selectedResult.id ? selectedResult : result
        )
      );
      setShowModal(false);
    } catch (error) {
      toast.error("Error updating result");
    }
  };
  const downloadExcel = () => {
    if (results.length === 0) {
      toast.warning("No results available to download.");
      return;
    }

    const worksheetData = results.map((res, index) => ({
      Sno: index + 1,
      Student: res.pin,
      Subject: res.subject_name,
      Unit: res.unit_field,
      Exam: res.exam,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "Student_Results.xlsx");
  };

  return (
    <div>
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3 d-flex justify-content-center">
          <Card
            className="animate__animated animate__fadeIn mt-2"
            style={{ width: "90%" }}
          >
            <Card.Header>
              <Card.Title>Filter and View Results</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form className="mb-3">
                <Form.Group controlId="formSession">
                  <Form.Label>Session</Form.Label>
                  <Form.Control
                    as="select"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                  >
                    <option value="">Select Session</option>
                    {sessions.map((sess) => (
                      <option key={sess.id} value={sess.id}>
                        {sess.year}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    as="select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={!session}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subj) => (
                      <option key={subj.id} value={subj.id}>
                        {subj.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formUnit">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    as="select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    disabled={!subject}
                  >
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unit_field}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button
                  className="mt-3 btn-success"
                  onClick={downloadExcel}
                  disabled={results.length === 0} // ✅ Disable until results are found
                >
                  {loading ? "Loading..." : "Download Excel"}
                </Button>
              </Form>
              <Table bordered hover striped>
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Student</th>
                    <th>Subject</th>
                    {results.length > 0 &&
                      results[0].co_marks.map((co) => (
                        <th key={co.id}>
                          {co.co_number} ({co.max_marks})
                        </th>
                      ))}
                    <th>Exam</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <Spinner animation="border" /> Loading...
                      </td>
                    </tr>
                  ) : results.length > 0 ? (
                    results.map((res, index) => (
                      <tr key={res.id}>
                        <td>{index + 1}</td>
                        <td>{res.pin}</td>
                        <td>{res.subject_name}</td>
                        {res.co_marks.map((co) => (
                          <td key={co.id}>{co.max_marks}</td>
                        ))}
                        <td>{res.exam}</td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleEditClick(res)}
                          >
                            <FaEdit /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Edit Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton closeVariant="white">
              <Modal.Title>Edit Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {selectedResult?.co_marks.map((co, index) => (
                  <Form.Group key={co.id} controlId={`co${co.id}`}>
                    <Form.Label>
                      {co.co_number} (Max: {co.max_marks})
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={co.total_marks}
                      onChange={(e) =>
                        handleCoMarksChange(index, e.target.value)
                      }
                    />
                  </Form.Group>
                ))}
                <br />
                <p className="ms-3">
                  Total marks = {selectedResult?.exam || ""}
                </p>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
  };

export default AllResult;
