import React, { useState, useEffect } from "react";
import StaffSideBar from "./StaffSideBar";
import Titile from "../../Home/Components/Titile";
import {
  Image,
  Alert,
  Button,
  Form,
  Modal,
  Card,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaperPlane } from "react-icons/fa";
import "../../App.css";

const NotifyStudent = () => {
  const [studentList, setStudentList] = useState([]);
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [sessionList, setSessionList] = useState([]);
  const [selectedSession, setSelectedSession] = useState("All");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [show, setShow] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const email = JSON.parse(localStorage.getItem("email")).replace(/^"|"$/g, "");

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
    
      try {
        const [studentResponse, sessionResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/count_stu/?email=${email}`),
          axios.get("http://localhost:8000/api/addsession/"),
        ]);

        setStudentList(studentResponse.data.student);
        setFilteredStudentList(studentResponse.data.student);
        setSessionList(sessionResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };

    fetchStudentsAndCourses();
  }, []);

  useEffect(() => {
    let filteredList = studentList;

    if (selectedSession !== "All") {
      filteredList = filteredList.filter(
        (student) => student.session_year === selectedSession
      );
    }

    setFilteredStudentList(filteredList);
  }, [selectedSession, studentList]);

  const handleCheckboxChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      const allStudentIds = filteredStudentList.map((student) => student.id);
      setSelectedStudents(allStudentIds);
    }
    setSelectAll(!selectAll);
  };

  const showModal = () => {
    if (selectedStudents.length === 0) {
      toast.warn(`Please select at least one student to notify`);
    } else {
      setShow(true);
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        student_ids: selectedStudents,
        email_content: emailContent,
        email : email
      };

      await axios.post("http://localhost:8000/api/send_email_student/", data);

      setEmailContent("");
      setShow(false);
      setError("");
      toast.success("Email sent successfully.");
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="root">
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideBar />
        <div className="dash flex-grow-1 p-3">
          <h2>Notify Students</h2>
          <br />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="btnn">
              <Button className="bttn px-5" onClick={showModal}>
                <FaPaperPlane /> Send Notification
              </Button>
            </div>
            <div className="d-flex gap-3">
              {/* Session Dropdown */}
              <Form.Select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="All">All Sessions</option>
                {sessionList.map((session) => (
                  <option key={session.id} value={session.session_name}>
                    {session.year}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="dash-container mt-3">
            <Card
              className="mt-3 animate__animated animate__fadeIn"
              style={{ width: "100%" }}
            >
              <Card.Header>
                <Card.Title className="d-flex justify-content-between">
                  Student Profiles
                  <Form.Check
                    type="checkbox"
                    label="Select All"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="staff-list-container animate__animated animate__fadeIn">
                  {filteredStudentList.map((student, index) => (
                    <div
                      className={`chat mb-2 d-flex align-items-center p-2 rounded border ${
                        selectedStudents.includes(student.id)
                          ? "bg-info-subtle"
                          : "bg-light"
                      }`}
                      key={index}
                      onClick={() => handleCheckboxChange(student.id)}
                      style={{
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <Form.Check
                        className="me-3"
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleCheckboxChange(student.id)}
                      />
                      <Image
                        roundedCircle
                        height={50}
                        width={50}
                        src={`http://localhost:8000${student.profile_pic}`}
                        alt="Profile Picture"
                        className="me-3 border"
                      />
                      <div className="staff-info d-flex justify-content-between align-items-center w-100">
                        <div>
                          <h5 className="mb-0">{student.student_name}</h5>
                          <small className="text-muted">{student.email}</small>
                        </div>
                        <p className="mb-0">
                          {student.course_name}({student.session_year})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
          {error && (
            <Alert variant="danger">
              <p className="text-danger">{error}</p>
            </Alert>
          )}
        </div>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Send Email to Selected Students</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSendMail}>
              <Form.Group>
                <Form.Label>Email Content:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Type your message here"
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="form-group justify-content-center d-flex">
                <Button
                  className="px-5 py-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    <span>
                      <FaPaperPlane /> Send Notification
                    </span>
                  )}
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              className="px-5"
              onClick={() => setShow(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NotifyStudent;
