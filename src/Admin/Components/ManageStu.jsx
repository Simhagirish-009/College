// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminSideNav from "./AdminSideNav";
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Spinner,
  Image,
} from "react-bootstrap";
import Titile from "../../Home/Components/Titile";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageStudents = () => {
  const [studentList, setStudentList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState({
    id: "",
    student_name: "",
    email: "",
    pin: "",
    course: "",
    session: "",
  });
  const [detailModal, setDetailModal] = useState(false);
  const [details, setDetails] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedSession, setSelectedSession] = useState("All");
  const [sessionList, setSessionList] = useState([]);

  const handleShowDetails = (student) => {
    setDetailModal(true);
    setDetails(student);
  };

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
        setCourses(courseResponse.data);
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

  const openDeleteModal = (studentId) => {
    setSelectedStudentId(studentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudentId) return;

    setLoading(true); // Start loading for delete
    try {
      await axios.delete(
        `http://localhost:8000/api/student_view/${selectedStudentId}/`
      );
      setStudentList(
        studentList.filter((student) => student.id !== selectedStudentId)
      );
      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student");
    } finally {
      setLoading(false); // Stop loading for delete
      setShowDeleteModal(false);
      setSelectedStudentId(null);
    }
  };

  const handleEdit = (student) => {
    setEditStudent({
      id: student.id,
      student_name: student.student_name,
      email: student.email,
      course: student.course,
      session: student.session,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    setLoading(true); // Start loading for edit
    try {
      await axios.put(
        `http://localhost:8000/api/student_view/${editStudent.id}/`,
        editStudent
      );
      const response = await axios.get(
        "http://localhost:8000/api/student_view/"
      );
      setStudentList(response.data);
      setShowEditModal(false);
      toast.success("Student updated successfully");
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Error updating student");
    } finally {
      setLoading(false); // Stop loading for edit
    }
  };

  const isFormValid = () => {
    return (
      editStudent.student_name &&
      editStudent.email &&
      editStudent.course &&
      editStudent.session
    );
  };

  return (
    <div className="root">
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="d-flex justify-content-between">
            <h2>Manage Student</h2>
            <div className="d-flex gap-3">
              {/* Course Dropdown */}
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="All">All Courses</option>
                {courses.map((course) => (
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
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <div className="dash-container mt-3">
              <Card className="mt-3" style={{ width: "100%" }}>
                <Card.Header>
                  <Card.Title>Students List</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table
                    bordered
                    striped
                    hover
                    className="animate__animated animate__slideInUp"
                  >
                    <thead>
                      <tr>
                        <th>Sno</th>
                        <th>Student Name</th>
                        <th>Pin</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th style={{ textAlign: "center" }}>Edit</th>
                        <th style={{ textAlign: "center" }}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudentList.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => handleShowDetails(student)}
                          >
                            {student.student_name}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => handleShowDetails(student)}
                          >
                            {student.pin}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => handleShowDetails(student)}
                          >
                            {student.email}
                          </td>
                          <td>{student.course_name}</td>
                          <td>{student.session_year}</td>
                          <td style={{ textAlign: "center" }}>
                            <Button onClick={() => handleEdit(student)}>
                              <FaEdit /> Edit
                            </Button>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Button
                              variant="danger"
                              onClick={() => openDeleteModal(student.id)}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                value={editStudent.student_name}
                onChange={(e) =>
                  setEditStudent({
                    ...editStudent,
                    student_name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editStudent.email}
                onChange={(e) =>
                  setEditStudent({ ...editStudent, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={editStudent.course}
                onChange={(e) =>
                  setEditStudent({ ...editStudent, course: e.target.value })
                }
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Session</Form.Label>
              <Form.Select
                value={editStudent.session}
                onChange={(e) =>
                  setEditStudent({ ...editStudent, session: e.target.value })
                }
                required
              >
                <option value="">-- Select Year --</option>
                {sessionList.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <br />
            <Form.Group className="btnn d-flex justify-content-center">
              <Button
                className="bttn px-5"
                variant="primary"
                onClick={handleEditSubmit}
                disabled={!isFormValid() || loading}
              >
                Save Changes
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="px-5"
            variant="danger"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={detailModal} onHide={() => setDetailModal(false)} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Student Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center mb-3">
            <Image
              style={{ border: "5px solid grey" }}
              roundedCircle
              height={150}
              width={150}
              src={`http://localhost:8000${details.profile_pic}`}
              alt="Profile Picture"
            />
            <h4 className="mt-3">{details.student_name}</h4>
            <p className="text-muted">
              {details.course_name || "Course not assigned"}
            </p>
          </div>
          <Card className="shadow-sm p-3 mb-3" style={{ width: "100%" }}>
            <div className="mb-2">
              <h6 className="mb-1">Email:</h6>
              <p className="text-secondary mb-0">{details.email}</p>
            </div>
            <hr />
            <div className="mb-2">
              <h6 className="mb-1">Pin:</h6>
              <p className="text-secondary mb-0">{details.pin}</p>
            </div>
            <hr />
            <div className="mb-2">
              <h6 className="mb-1">Session:</h6>
              <p className="text-secondary mb-0">
                {details.session_start} - {details.session_end}
              </p>
            </div>
            <hr />
            <div className="mb-2">
              <h6 className="mb-1">Gender:</h6>
              <p className="text-secondary mb-0">
                {details.gender || "Not specified"}
              </p>
            </div>
            <hr />
            <div className="mb-2">
              <h6 className="mb-1">Address:</h6>
              <p className="text-secondary mb-0">
                {details.address || "Not provided"}
              </p>
            </div>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="px-5"
            variant="danger"
            onClick={() => setDetailModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this student?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
// =======
// import React, { useState, useEffect } from 'react';
// import AdminSideNav from './AdminSideNav';
// import { Table, Alert, Button, Modal, Form, Card, Spinner , Image , ListGroup } from 'react-bootstrap';
// import Titile from '../../Home/Components/Titile';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../../App.css';

// const ManageStudents = () => {
//     const [studentList, setStudentList] = useState([]);
//     const [courses, setCourses] = useState([]);
//     const [sessions, setSessions] = useState([]);
//     const [loading, setLoading] = useState(false);  // Loading state
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editStudent, setEditStudent] = useState({
//         id: '',
//         student_name: '',
//         email: '',
//         course: '',
//         session: '',
//     });
//     const [detailModal,setDetailModal] = useState(false)
//     const [details,setDetails] = useState([])

//     const handleShowDetails = (student) => {
//         setDetailModal(true)
//         setDetails(student)
//     }

//     // Fetch students, courses, and sessions
//     useEffect(() => {
//         const fetchStudents = async () => {
//             setLoading(true); // Start loading
//             try {
//                 const response = await axios.get('http://localhost:8000/api/student_view/');
//                 setStudentList(response.data);
//                 toast.success('Students fetched successfully'); // Notify on success
//             } catch (error) {
//                 console.error("Error fetching students:", error);
//                 toast.error('Error fetching students'); // Notify on error
//             } finally {
//                 setLoading(false); // Stop loading
//             }
//         };

//         const fetchCourses = async () => {
//             setLoading(true); // Start loading
//             try {
//                 const response = await axios.get('http://localhost:8000/api/addcourse/');
//                 setCourses(response.data);
//             } catch (error) {
//                 console.error('Error fetching courses:', error);
//                 toast.error('Error fetching courses'); // Notify on error
//             } finally {
//                 setLoading(false); // Stop loading
//             }
//         };

//         const fetchSessions = async () => {
//             setLoading(true); // Start loading
//             try {
//                 const response = await axios.get('http://localhost:8000/api/addsession/');
//                 setSessions(response.data);
//             } catch (error) {
//                 console.error("Error fetching sessions:", error);
//                 toast.error('Error fetching sessions'); // Notify on error
//             } finally {
//                 setLoading(false); // Stop loading
//             }
//         };

//         fetchStudents();
//         fetchCourses();
//         fetchSessions();
//     }, []);

//     const handleDelete = async (studentId) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this student?");
//         if (!confirmDelete) return;

//         setLoading(true); // Start loading for delete
//         try {
//             await axios.delete(`http://localhost:8000/api/student_view/${studentId}/`);
//             setStudentList(studentList.filter(student => student.id !== studentId));
//             toast.success('Student deleted successfully');
//         } catch (error) {
//             console.error('Error deleting student:', error);
//             toast.error('Error deleting student');
//         } finally {
//             setLoading(false); // Stop loading for delete
//         }
//     };

//     const handleEdit = (student) => {
//         setEditStudent({
//             id: student.id,
//             student_name: student.student_name,
//             email: student.email,
//             course: student.course,
//             session: student.session,
//         });
//         setShowEditModal(true);
//     };

//     const handleEditSubmit = async () => {
//         setLoading(true); // Start loading for edit
//         try {
//             await axios.put(`http://localhost:8000/api/student_view/${editStudent.id}/`, editStudent);
//             const response = await axios.get('http://localhost:8000/api/student_view/');
//             setStudentList(response.data);
//             setShowEditModal(false);
//             toast.success('Student updated successfully');
//         } catch (error) {
//             console.error("Error updating student:", error);
//             toast.error("Error updating student");
//         } finally {
//             setLoading(false); // Stop loading for edit
//         }
//     };

//     const isFormValid = () => {
//         return editStudent.student_name && editStudent.email && editStudent.course && editStudent.session;
//     };

//     return (
//         <div>
//             <Titile />
//             <ToastContainer />
//             <div className='d-lg-flex d-md-block d-sm-block'>
//                 <AdminSideNav />
//                 <div className="dash flex-grow-1 p-3">
//                     <h2>Manage Students</h2>
//                     <br />
//                     {loading ? (
//                         <Spinner animation="border" />
//                     ) : (
//                         <div className='dash-container mt-3'>
//                             <Card className="mt-3" style={{ width: '100%' }}>
//                                 <Card.Header>
//                                     <Card.Title>Students List</Card.Title>
//                                 </Card.Header>
//                                 <Card.Body>
//                                     <Table bordered striped hover className='animate__animated animate__slideInUp'>
//                                         <thead>
//                                             <tr>
//                                                 <th>Sno</th>
//                                                 <th>Student Name</th>
//                                                 <th>Email</th>
//                                                 <th>Course</th>
//                                                 <th>Start Year</th>
//                                                 <th>Edit</th>
//                                                 <th>Delete</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {studentList.map((student, index) => (
//                                                 <tr key={student.id} style={{cursor : 'pointer'}} onClick={() => handleShowDetails(student)}>
//                                                     <td>{index + 1}</td>
//                                                     <td>{student.student_name}</td>
//                                                     <td>{student.email}</td>
//                                                     <td>{student.course_name}</td>
//                                                     <td>{student.session_start}</td>
//                                                     <td><Button onClick={() => handleEdit(student)}>Edit</Button></td>
//                                                     <td><Button variant='danger' onClick={() => handleDelete(student.id)}>Delete</Button></td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>
//                                 </Card.Body>
//                             </Card>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Edit Modal */}
//             <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Student</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group>
//                             <Form.Label>Student Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 value={editStudent.student_name}
//                                 onChange={(e) => setEditStudent({ ...editStudent, student_name: e.target.value })}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Email</Form.Label>
//                             <Form.Control
//                                 type="email"
//                                 value={editStudent.email}
//                                 onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Course</Form.Label>
//                             <Form.Select
//                                 value={editStudent.course}
//                                 onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })}
//                                 required
//                             >
//                                 <option value="">-- Select Course --</option>
//                                 {courses.map(course => (
//                                     <option key={course.id} value={course.id}>
//                                         {course.name}
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Session</Form.Label>
//                             <Form.Select
//                                 value={editStudent.session}
//                                 onChange={(e) => setEditStudent({ ...editStudent, session: e.target.value })}
//                                 required
//                             >
//                                 <option value="">-- Select Start Year --</option>
//                                 {sessions.map(session => (
//                                     <option key={session.id} value={session.id}>
//                                         {session.start_year} --- {session.end_year}
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
//                     <Button variant="primary" onClick={handleEditSubmit} disabled={!isFormValid() || loading}>Save Changes</Button>
//                 </Modal.Footer>
//             </Modal>
            
//                 <Modal show={detailModal} onHide={() => setDetailModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Student details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div className='d-flex flex-column align-items-center'>
//                         <Image style={{border : '5px solid grey'}}  roundedCircle height={150} width={150} src={`http://localhost:8000${details.profile_pic}`}/>
//                         <h3>{details.student_name}</h3>
//                         <h3>{details.course_name}</h3>
//                     </div>
//                     <div>
//                         <ListGroup style={{fontSize : '15px'}}>
//                             <ListGroup.Item>Email : {details.email}</ListGroup.Item>
//                             <ListGroup.Item>Session : {details.session_start} - {details.session_end}</ListGroup.Item>
//                             <ListGroup.Item>Gender : {details.gender}</ListGroup.Item>
//                             <ListGroup.Item>Address : {details.address}</ListGroup.Item>
//                         </ListGroup>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" className='px-5' onClick={() => setDetailModal(false)}>Cancel</Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default ManageStudents;
