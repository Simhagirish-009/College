// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Card,
  Spinner,
  ToastContainer,
} from "react-bootstrap";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import * as XLSX from "xlsx";

const ViewAllResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [selectedResult, setSelectedResult] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [unit, setUnit] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [coursesRes, sessionsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/addcourse/"),
          axios.get("http://localhost:8000/api/addsession/"),
        ]);
        setCourses(coursesRes.data);
        setSessions(sessionsRes.data);
      } catch (error) {
        toast.error("Error fetching dropdown data");
      }
    };

    fetchDropdownData();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/all_results/",
        {
          params: {
            course: selectedCourse,
            session: selectedSession,
            unit : unit
          },
        }
      );
      setResults(response.data);
    } catch (error) {
      toast.error("Error fetching results");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (results.length === 0) {
      toast.warning("No results available to download.");
      return;
    }

    // Format data for Excel
    const worksheetData = results.map((res, index) => ({
      Sno: index + 1,
      Student: res.pin,
      Subject: res.subject_name,
      Unit: res.unit_field,
      Exam: res.exam,
    }));

    // Create a new worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    // Download the file
    XLSX.writeFile(workbook, "Student_Results.xlsx");
  };
  // const handleSave = async () => {
  //   try {
  //     await axios.put(
  //       `http://localhost:8000/api/edit_result/${selectedResult.id}/`,
  //       {
  //         test: selectedResult.test,
  //         exam: selectedResult.exam,
  //       }
  //     );
  //     toast.success("Result updated successfully");
  //     setResults((prevResults) =>
  //       prevResults.map((result) =>
  //         result.id === selectedResult.id
  //           ? {
  //               ...result,
  //               test: selectedResult.test,
  //               exam: selectedResult.exam,
  //             }
  //           : result
  //       )
  //     );
  //     setShowModal(false);
  //   } catch (error) {
  //     toast.error("Error updating result");
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedResult((prevResult) => ({
  //     ...prevResult,
  //     [name]: value,
  //   }));
  // };

  return (
    <div className="root">
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container d-flex justify-content-center">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "90%" }}
            >
              <Card.Header>
                <Card.Title>View Student Results</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form className="mb-4">
                  <Form.Group controlId="formCourse">
                    <Form.Label>Select Course</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formSession">
                    <Form.Label>Select Session</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                    >
                      <option value="">Select Session</option>
                      {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.year}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      as="select"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="">Select Unit</option>
                      <option value={1}>Unit 1</option>
                      <option value={2}>Unit 2</option>
                      <option value={3}>Unit 3</option>
                    </Form.Control>
                  </Form.Group>
                  <div className="btnn">
                    <Button className="mt-3 bttn px-5" onClick={fetchResults}>
                      Fetch Results
                    </Button>
                  </div>
                </Form>
                <Button
                  className="mt-3 btn-success px-5"
                  onClick={downloadExcel}
                  disabled={results.length === 0}
                >
                  Download Excel
                </Button>
                <br />
                <Table bordered hover striped>
                  <thead>
                    <tr>
                      <th>Sno</th>
                      <th>Student</th>
                      <th>Subject</th>
                      <th>Unit</th>
                      <th>Exam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          <Spinner animation="border" /> Loading...
                        </td>
                      </tr>
                    ) : results.length > 0 ? (
                      results.map((res, index) => (
                        <>
                          <tr key={res.id}>
                            <td>{index + 1}</td>
                            <td>{res.pin}</td>
                            <td>{res.subject_name}</td>
                            <td>{res.unit}</td>
                            <td>{res.exam}</td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllResults;
