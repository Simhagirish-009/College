// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { Table, Button, Form, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import * as XLSX from "xlsx";

const ViewAllAtt = () => {
  const [attendance, setAttendance] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");

  // Fetch courses and sessions data
  useEffect(() => {
    const fetchCoursesAndSessions = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:8000/api/addcourse/`
        );
        const sessionResponse = await axios.get(
          `http://localhost:8000/api/addsession/`
        );
        setCourses(courseResponse.data);
        setSessions(sessionResponse.data);
      } catch (error) {
        console.error("Error fetching course/session data", error);
        toast.error("Failed to load course and session data");
      }
    };
    fetchCoursesAndSessions();
  }, []);

  // Fetch attendance data based on course and session
  const fetchAttendanceData = async () => {
    if (selectedCourse && selectedSession && month) {
      setLoading(true);
      try {
        const attResponse = await axios.get(
          `http://localhost:8000/api/all_att/`,
          {
            params: { course: selectedCourse, session: selectedSession , month : month },
          }
        );
        const reportResponse = await axios.get(
          `http://localhost:8000/api/all_attreport/`,
          {
            params: { course: selectedCourse, session: selectedSession , month : month },
          }
        );
        setAttendance(attResponse.data);
        setAttendanceReport(reportResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data", error);
        toast.error("Failed to load attendance data");
        setLoading(false);
      }
    } else {
      toast.warning("Please select both course and session");
    }
  };
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendanceReport.map((report, index) => {
        const att = attendance.find((a) => a.id === report.attendance);
        return {
          Sno: index + 1,
          Session: att?.session_name,
          Subject: att?.subject_name,
          Date: att?.date,
          Student: report.student_name,
          Status: report.att_status ? "Present" : "Absent",
        };
      })
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, "Attendance_Report.xlsx");
  };

  return (
    <div className="root">
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container d-flex justify-content-center">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "90%" }}
            >
              <Card.Header>
                <Card.Title>View Attendance</Card.Title>
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
                    <Form.Label>Month : </Form.Label>
                    <Form.Control
                      as="select"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value="">Select Month</option>
                      <option value={1}>January</option>
                      <option value={2}>Feabruary</option>
                      <option value={3}>March</option>
                      <option value={4}>April</option>
                      <option value={5}>May</option>
                      <option value={6}>June</option>
                      <option value={7}>July</option>
                      <option value={8}>August</option>
                      <option value={9}>September</option>
                      <option value={10}>October</option>
                      <option value={11}>November</option>
                      <option value={12}>December</option>
                    </Form.Control>
                  </Form.Group>
                  <br />
                  <div className="btnn">
                    <Button className="bttn px-5" onClick={fetchAttendanceData}>
                      Fetch Attendance
                    </Button>
                  </div>
                </Form>
                <Button className="bttn px-5 ml-3" onClick={downloadExcel}>
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
      <ToastContainer />
    </div>
  );
};

export default ViewAllAtt;
