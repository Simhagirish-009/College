// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Table, Alert, Card, Spinner, Form } from "react-bootstrap";
import StudentSideNav from "./StudentSideNav";
import Titile from "../../Home/Components/Titile";
import axios from "axios";

const ViewAtt = () => {
  const [attendance, setAttendance] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = JSON.parse(localStorage.getItem("email")); // Get the email from local storage
  const [month, setMonth] = useState("");
  const [att_percentage, setAtt_percentage] = useState(null);
  const [overall,setOverall]=useState(null);
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const cleanedEmail = email.replace(/^"|"$/g, "");
        const attResponse = await axios.get(
          `http://localhost:8000/api/viewattstu/?email=${cleanedEmail}&month=${month}`
        );
        setAttendance(attResponse.data || []);

        const reportResponse = await axios.get(
          `http://localhost:8000/api/viewatt_report_stu/?email=${cleanedEmail}&month=${month}`
        );

        const data = reportResponse.data || {};
        setAttendanceReport(data.attendance_data || []);
        setAtt_percentage(data.attendance_percentage ?? 0);
        setOverall(data.month_attendance_percentage ?? 0);
      } catch (error) {
        console.error("Error fetching attendance data", error);
        setError("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [email, month]);

  return (
    <div>
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StudentSideNav />
        <div className="flex-grow-1 p-3">
          {error && <Alert variant="danger">{error}</Alert>}
          <Card
            className="animate__animated animate__fadeIn mt-2"
            style={{ width: "100%" }}
          >
            <Card.Header>
              <Card.Title>View Attendance</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
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
              </Form>
              <br />
              <p>The Overall Attendance = {overall}%</p>
              {loading ? (
                <Spinner animation="border" role="status"></Spinner>
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
                    {month && (
                      <tr>
                        <td colSpan={6}>percentage = {att_percentage}%</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewAtt;
