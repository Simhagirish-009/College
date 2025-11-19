// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Titile from "../../Home/Components/Titile"; // Corrected import
import StaffSideNav from "./StaffSideBar";
import { Card, Table, Spinner, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const AttReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [sessions, setSessions] = useState([]); // Added state for sessions
  const [subjects, setSubjects] = useState([]); // Added state for subjects
  const [session, setSession] = useState(""); // Added state for selected session
  const [subject, setSubject] = useState(""); // Added state for selected subject
  const [students, setStudents] = useState([]); // Added state for students
  const [date, setDate] = useState(""); // Added state for date
  const [fetchStudents, setFetchStudents] = useState(false); // Added state for fetching students

  const email = localStorage.getItem("email");
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true); // Ensure loading is set to true before fetching
      try {
        const response = await axios.get("http://localhost:8000/api/addsession/");
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("Error fetching sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [email]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const cleanedEmail = email.replace(/^"|"$/g, "");
        const response = await axios.get(
          `http://localhost:8000/api/addsub/?session=${session}&email=${cleanedEmail}`
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Error fetching subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [session, email]);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true); // Ensure loading is set to true before fetching
      if (!session || !subject) return; // Ensure session and subject are selected

      try {
        const cleanedEmail = email.replace(/^"|"$/g, "");
        const attResponse = await axios.get(
          `http://localhost:8000/api/viewatt/?email=${cleanedEmail}&session=${session}&subject=${subject}`
        );
        setAttendance(attResponse.data);

        const reportResponse = await axios.get(
          `http://localhost:8000/api/viewarr_report/?email=${cleanedEmail}&session=${session}&subject=${subject}`
        );
        setAttendanceReport(reportResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data", error);
        toast.error("Failed to load attendance data");
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [session, subject, email]); // Fetch attendance when session or subject changes

  // Open edit modal
  const handleEditClick = (report) => {
    setSelectedReport(report);
    setNewStatus(report.att_status); // set current status as default
    setShowModal(true);
  };

  // Update attendance report
  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/update_attendance_report/${selectedReport.id}/`,
        {
          att_status: newStatus,
        }
      );
      toast.success("Attendance status updated successfully");

      // Update the frontend data
      setAttendanceReport((prevReports) =>
        prevReports.map((report) =>
          report.id === selectedReport.id
            ? { ...report, att_status: newStatus }
            : report
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error updating attendance status", error);
      toast.error("Failed to update attendance status");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Logic for form submission can be added here
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(attendanceReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
    XLSX.writeFile(wb, "AttendanceReport.xlsx");
  };

  return (
    <div>
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container d-flex justify-content-center">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "90%" }}
            >
              <Card.Header>
                <Card.Title>Take Attendance</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
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
                  <Form.Group className="form-group justify-content-center d-flex">
                    <Button
                      className="px-5 py-2"
                      type="button"
                      onClick={() => {
                        if (!session || !subject) {
                          toast.error("Please select a session and subject");
                          return;
                        }
                        setFetchStudents(true);
                      }}
                    >
                      Fetch Students
                    </Button>
                  </Form.Group>
                  <br />

                  {students.length > 0 && (
                    <>
                      <br />
                      <Form.Group>
                        <Form.Label>Date:</Form.Label>
                        <Form.Control
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <br />

                      <br />
                      <Button className="px-5 py-2" type="submit">
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Fetch Attendance"
                        )}
                      </Button>
                    </>
                  )}
                </Form>
                <Button className="mb-3" onClick={exportToExcel}>
                  Download Excel
                </Button>
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Sno</th>
                        <th>Session</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceReport.map((report, index) => {
                        const att = attendance.find(
                          (a) => a.id === report.attendance
                        );
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{att?.session_name}</td>
                            <td>{att?.subject_name}</td>
                            <td>{att?.date}</td>
                            <td>{report.student_name}</td>
                            <td>{report.att_status ? "Present" : "Absent"}</td>
                            <td>
                              <Button
                                variant="primary"
                                onClick={() => handleEditClick(report)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Attendance Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value === "true")}
              >
                <option value="true">Present</option>
                <option value="false">Absent</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
// =======
// import React, { useState, useEffect } from 'react';
// import Titile from '../../Home/Components/Titile';
// import StaffSideNav from './StaffSideBar';
// import { Card, Table, Spinner, Button, Modal, Form } from 'react-bootstrap';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttReport = () => {
//     const [attendance, setAttendance] = useState([]);
//     const [attendanceReport, setAttendanceReport] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [newStatus, setNewStatus] = useState(null);
    
//     const email = localStorage.getItem('email');

//     // Fetch attendance data
//     useEffect(() => {
//         const fetchAttendance = async () => {
//             try {
//                 const cleanedEmail = email.replace(/^"|"$/g, ''); 
//                 const attResponse = await axios.get(`http://localhost:8000/api/viewatt/?email=${cleanedEmail}`);
//                 setAttendance(attResponse.data);
//                 const reportResponse = await axios.get(`http://localhost:8000/api/viewarr_report/?email=${cleanedEmail}`);
//                 setAttendanceReport(reportResponse.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching attendance data", error);
//                 toast.error("Failed to load attendance data");
//                 setLoading(false);
//             }
//         };
//         fetchAttendance();
//     }, []);

//     // Open edit modal
//     const handleEditClick = (report) => {
//         setSelectedReport(report);
//         setNewStatus(report.att_status); // set current status as default
//         setShowModal(true);
//     };

//     // Update attendance report
//     const handleSaveChanges = async () => {
//         try {
//             await axios.put(`http://localhost:8000/api/update_attendance_report/${selectedReport.id}/`, {
//                 att_status: newStatus,
//             });
//             toast.success("Attendance status updated successfully");

//             // Update the frontend data
//             setAttendanceReport(prevReports =>
//                 prevReports.map(report =>
//                     report.id === selectedReport.id ? { ...report, att_status: newStatus } : report
//                 )
//             );

//             setShowModal(false);
//         } catch (error) {
//             console.error("Error updating attendance status", error);
//             toast.error("Failed to update attendance status");
//         }
//     };

//     return (
//         <div>
//             <Titile />
//             <div className="d-lg-flex d-md-block d-sm-block">
//                 <StaffSideNav />
//                 <div className="dash flex-grow-1 p-3">
//                     <div className="dash-container d-flex justify-content-center">
//                         <Card className="animate__animated animate__fadeIn mt-2" style={{ width: '90%' }}>
//                             <Card.Header>
//                                 <Card.Title>Take Attendance</Card.Title>
//                             </Card.Header>
//                             <Card.Body>
//                                 {loading ? (
//                                     <div className="text-center">
//                                         <Spinner animation="border" />
//                                     </div>
//                                 ) : (
//                                     <Table striped bordered hover responsive>
//                                         <thead>
//                                             <tr>
//                                                 <th>Sno</th>
//                                                 <th>Session</th>
//                                                 <th>Subject</th>
//                                                 <th>Date</th>
//                                                 <th>Student</th>
//                                                 <th>Status</th>
//                                                 <th>Action</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {attendanceReport.map((report, index) => {
//                                                 const att = attendance.find((a) => a.id === report.attendance);
//                                                 return (
//                                                     <tr key={index}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{att?.session_name}</td>
//                                                         <td>{att?.subject_name}</td>
//                                                         <td>{att?.date}</td>
//                                                         <td>{report.student_name}</td>
//                                                         <td>{report.att_status ? "Present" : "Absent"}</td>
//                                                         <td>
//                                                             <Button variant="primary" onClick={() => handleEditClick(report)}>
//                                                                 Edit
//                                                             </Button>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </Table>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </div>
//                 </div>
//             </div>

//             {/* Edit Modal */}
//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Attendance Status</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group controlId="formStatus">
//                             <Form.Label>Status</Form.Label>
//                             <Form.Control
//                                 as="select"
//                                 value={newStatus}
//                                 onChange={(e) => setNewStatus(e.target.value === "true")}
//                             >
//                                 <option value="true">Present</option>
//                                 <option value="false">Absent</option>
//                             </Form.Control>
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>
//                         Cancel
//                     </Button>
//                     <Button variant="primary" onClick={handleSaveChanges}>
//                         Save Changes
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <ToastContainer />
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default AttReport;
