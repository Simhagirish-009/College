// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminSideNav from "./AdminSideNav";
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

const NotifyStu = () => {
  const [studentList, setStudentList] = useState([]);
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [sessionList, setSessionList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
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
        const [studentResponse, courseResponse, sessionResponse] =
          await Promise.all([
            axios.get("http://localhost:8000/api/student_view/"),
            axios.get("http://localhost:8000/api/addcourse/"),
            axios.get("http://localhost:8000/api/addsession/"),
          ]);

        setStudentList(studentResponse.data);
        setFilteredStudentList(studentResponse.data);
        setCourseList(courseResponse.data);
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

     if (selectedCourse !== "All") {
       filteredList = filteredList.filter(
         (student) => student.course_name === selectedCourse
       );
     }

     if (selectedSession !== "All") {
       filteredList = filteredList.filter(
         (student) => student.session_year === selectedSession
       );
     }

     setFilteredStudentList(filteredList);
   }, [selectedCourse, selectedSession, studentList]);

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
        <AdminSideNav />
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
              {/* Course Dropdown */}
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="All">All Courses</option>
                {courseList.map((course) => (
                  <option key={course.id} value={course.course_name}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>

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
// =======
// import React, { useState, useEffect } from 'react';
// import AdminSideNav from './AdminSideNav';
// import Titile from '../../Home/Components/Titile';
// import { Table, Alert, Button, Form, Modal, Card, Spinner } from 'react-bootstrap';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../../App.css';

// const NotifyStu = () => {
//     const [studentList, setStudentList] = useState([]);
//     const [selectedStudents, setSelectedStudents] = useState([]);
//     const [selectAll, setSelectAll] = useState(false);
//     const [show, setShow] = useState(false);
//     const [emailContent, setEmailContent] = useState('');
//     const [isLoading, setIsLoading] = useState(false); // Loading state
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/student_view/');
//                 setStudentList(response.data);
//             } catch (error) {
//                 console.error("Error fetching students:", error);
//                 toast.error('Error fetching students'); // Show error toast
//             }
//         };

//         fetchStudents();
//     }, []);

//     const handleCheckboxChange = (studentId) => {
//         if (selectedStudents.includes(studentId)) {
//             setSelectedStudents(selectedStudents.filter(id => id !== studentId));
//         } else {
//             setSelectedStudents([...selectedStudents, studentId]);
//         }
//     };

//     const handleSelectAll = () => {
//         if (selectAll) {
//             setSelectedStudents([]);
//         } else {
//             const allStudentIds = studentList.map(student => student.id);
//             setSelectedStudents(allStudentIds);
//         }
//         setSelectAll(!selectAll);
//     };

//     const showModal = () => {
//         if (selectedStudents.length === 0) {
//             setError("Please select at least one student to notify.");
//         } else {
//             setShow(true);
//         }
//     };

//     const handleSendMail = async (e) => {
//         e.preventDefault();
//         setIsLoading(true); // Start loading
//         try {
//             const data = {
//                 student_ids: selectedStudents,
//                 email_content: emailContent
//             };

//             const response = await axios.post('http://localhost:8000/api/send_student_email/', data);
//             console.log('Response from server:', response.data);

//             setEmailContent('');
//             setShow(false);
//             setError('');
//             toast.success('Email sent successfully.'); // Show success toast
//             setSelectedStudents([]);
//         } catch (error) {
//             console.error('Error sending email:', error);
//             toast.error('Failed to send email.'); // Show error toast
//         } finally {
//             setIsLoading(false); // Stop loading
//         }
//     };

//     return (
//         <div>
//             <Titile />
//             <div className='d-lg-flex d-md-block d-sm-block'>
//                 <AdminSideNav />
//                 <div className="dash flex-grow-1 p-3">
//                     <h2>Notify Students</h2> <br />
//                     <div className='btnn'>
//                         <Button className='bttn px-5' onClick={showModal}>Send Mail</Button><br />
//                     </div>
//                     <div className='dash-container mt-3'>
//                         <Card className="mt-3" style={{ width: '100%' }}>
//                             <Card.Header>
//                                 <Card.Title>Leave Requests</Card.Title>
//                             </Card.Header>
//                             <Card.Body>
//                                 <Table bordered striped className='animate__animated animate__slideInUp'>
//                                     <thead>
//                                         <tr>
//                                             <th style={{ width: '150px' }}>
//                                                 <Form.Check
//                                                     type="checkbox"
//                                                     checked={selectAll}
//                                                     onChange={handleSelectAll}
//                                                     label="Select All"
//                                                 />
//                                             </th>
//                                             <th>Sno</th>
//                                             <th>Student Name</th>
//                                             <th>Email</th>
//                                             <th>Course</th>
//                                             <th>Session</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {studentList.map((student, index) => (
//                                             <tr key={index}>
//                                                 <td>
//                                                     <Form.Check
//                                                         type="checkbox"
//                                                         checked={selectedStudents.includes(student.id)}
//                                                         onChange={() => handleCheckboxChange(student.id)}
//                                                     />
//                                                 </td>
//                                                 <td>{index + 1}</td>
//                                                 <td>{student.student_name}</td>
//                                                 <td>{student.email}</td>
//                                                 <td>{student.course_name}</td>
//                                                 <td>{student.session_start}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>
//                             </Card.Body>
//                         </Card>
//                     </div>

//                     {error && <Alert variant='danger'><p className="text-danger">{error}</p></Alert>}
//                 </div>

//                 <Modal show={show} onHide={() => setShow(false)}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Send Email to Selected Students</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <Form onSubmit={handleSendMail}>
//                             <Form.Group>
//                                 <Form.Label>Email Content:</Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={5}
//                                     value={emailContent}
//                                     onChange={e => setEmailContent(e.target.value)}
//                                     placeholder="Type your message here"
//                                     required
//                                 />
//                             </Form.Group>
//                             <br />
//                             <Form.Group className='form-group justify-content-center d-flex'>
//                                 <Button className='px-5 py-2' type='submit' disabled={isLoading}>
//                                     {isLoading ? (
//                                         <>
//                                             <Spinner animation="border" size="sm" className="me-2" />
//                                             Sending...
//                                         </>
//                                     ) : (
//                                         'Send Email'
//                                     )}
//                                 </Button>
//                             </Form.Group>
//                         </Form>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button variant="danger" className='px-5' onClick={() => setShow(false)}>Close</Button>
//                     </Modal.Footer>
//                 </Modal>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default NotifyStu;
