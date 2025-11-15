// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const ManageSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [units,setUnits] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // Form Fields
  const [subjectName, setSubjectName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [editSubject, setEditSubject] = useState({
    id: "",
    name: "",
    course: "",
    staff: "",
    session: "",
  });

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectsRes, coursesRes, sessionsRes , unitRes] = await Promise.all([
        axios.get("http://localhost:8000/api/addsub/"),
        axios.get("http://localhost:8000/api/addcourse/"),
        axios.get("http://localhost:8000/api/addsession/"),
        axios.get("http://localhost:8000/api/addunit/"),
      ]);
      setSubjects(subjectsRes.data);
      setCourses(coursesRes.data);
      setSessions(sessionsRes.data);
      setUnits(unitRes.data)
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff based on selected course
  useEffect(() => {
    if (!selectedCourse) return;
    fetchStaff(selectedCourse);
  }, [selectedCourse]);

  const fetchStaff = async (courseId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/course_staff?course=${courseId}`
      );
      setStaff(response.data);
    } catch {
      toast.error("Failed to fetch staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Form Reset
  const resetFormFields = () => {
    setSubjectName("");
    setSelectedCourse("");
    setSelectedStaff("");
    setSelectedSession("");
    setError("");
  };

  // Delete Subject
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8000/api/addsub/${subjectToDelete.id}/`
      );
      setSubjects(
        subjects.filter((subject) => subject.id !== subjectToDelete.id)
      );
      toast.success("Subject deleted successfully!");
      setShowDeleteModal(false);
    } catch {
      toast.error("Failed to delete subject.");
    } finally {
      setLoading(false);
    }
  };

  // Add Subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!subjectName || !selectedStaff || !selectedCourse || !selectedSession) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/addsub/", {
        name: subjectName,
        course: selectedCourse,
        staff: selectedStaff,
        session: selectedSession,
      });
      setSubjects([...subjects, response.data]);
      toast.success("Subject added successfully!");
      setShowAddModal(false);
      resetFormFields();
    } catch {
      toast.error("Failed to add subject.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Subject
  const handleEdit = (subject) => {
    setEditSubject(subject);
    setSelectedCourse(subject.course);
    setSelectedStaff(subject.staff);
    setSelectedSession(subject.session);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (
      !editSubject.name ||
      !selectedCourse ||
      !selectedStaff ||
      !selectedSession
    ) {
      setError("All fields are required for updating");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/addsub/${editSubject.id}/`,
        {
          name: editSubject.name,
          course: selectedCourse,
          staff: selectedStaff,
          session: selectedSession,
        }
      );
      setSubjects(
        subjects.map((sub) => (sub.id === editSubject.id ? response.data : sub))
      );
      toast.success("Subject updated successfully!");
      setShowEditModal(false);
    } catch {
      toast.error("Failed to update subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <Titile />
      <div className="d-lg-flex">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Manage Subjects</h2>
          <br />
          <div className="btnn">
            <Button
              className="bttn px-5"
              onClick={() => {
                setShowAddModal(true);
                resetFormFields();
              }}
            >
              <FaPlus /> Add Subject
            </Button>
          </div>
          <Card className="mt-3" style={{ width: "100%" }}>
            <Card.Header>
              <Card.Title>Subjects list</Card.Title>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <Table
                  bordered
                  hover
                  striped
                  responsive
                  className="animate__animated animate__slideInUp"
                >
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Sno</th>
                      <th>Subject</th>
                      <th>Course</th>
                      <th>Staff</th>
                      <th>Session</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject, index) => (
                      <tr key={subject.id} style={{ textAlign: "center" }}>
                        <td>{index + 1}</td>
                        <td>{subject.name}</td>
                        <td>{subject.course_name}</td>
                        <td>{subject.staff_name}</td>
                        <td>{subject.year}</td>
                        <td>
                          <Button onClick={() => handleEdit(subject)}>
                            <FaEdit /> Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => {
                              setSubjectToDelete(subject);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <Table
                bordered
                hover
                striped
                responsive
                className="animate__animated animate__slideInUp"
              >
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th>Sno</th>
                    <th>Unit</th>
                    <th>Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((subject, index) => (
                    <tr key={subject.id} style={{ textAlign: "center" }}>
                      <td>{index + 1}</td>
                      <td>{subject.subject_name}</td>
                      <td>Unit : {subject.unit_field}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this subject?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Subject Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubject}>
            <Form.Group>
              <Form.Label>Subject Name:</Form.Label>
              <Form.Control
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course:</Form.Label>
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
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
              <Form.Label>Staff:</Form.Label>
              <Form.Select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                required
              >
                <option value="">-- Select Staff --</option>
                {staff.map((staffMember) => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.staff_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Session:</Form.Label>
              <Form.Select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                required
              >
                <option value="">-- Select Session --</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <br />
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="btnn d-flex justify-content-center ">
              <Button
                className="bttn px-5"
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Subject"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Edit Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group>
              <Form.Label>Subject Name:</Form.Label>
              <Form.Control
                type="text"
                value={editSubject.name}
                onChange={(e) =>
                  setEditSubject({ ...editSubject, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course:</Form.Label>
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
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
              <Form.Label>Staff:</Form.Label>
              <Form.Select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                required
              >
                <option value="">-- Select Staff --</option>
                {staff.map((staffMember) => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.staff_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Session:</Form.Label>
              <Form.Select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                required
              >
                <option value="">-- Select Session --</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.start_year} - {session.end_year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <br />
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="btnn d-flex justify-content-center">
              <Button
                className="bttn px-5"
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Subject"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
// =======
// import React, { useState, useEffect } from 'react';
// import { Button, Table, Modal, Form, Alert, Card, Spinner } from 'react-bootstrap';
// import AdminSideNav from './AdminSideNav';
// import Titile from '../../Home/Components/Titile';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';

// const ManageSubject = () => {
//     const [subjects, setSubjects] = useState([]);
//     const [courses, setCourses] = useState([]);
//     const [staff, setStaff] = useState([]);
//     const [sessions, setSessions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [subjectName, setSubjectName] = useState('');
//     const [selectedStaff, setSelectedStaff] = useState('');
//     const [selectedSession, setSelectedSession] = useState('');
//     const [selectedCourse, setSelectedCourse] = useState('');
//     const [editSubject, setEditSubject] = useState({ id: '', name: '', course: '', staff: '', session: '' });
//     const [error, setError] = useState('');

//     // Fetching data on component mount
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const [subjectsRes, coursesRes, staffRes, sessionsRes] = await Promise.all([
//                     axios.get('http://localhost:8000/api/addsub/'),
//                     axios.get('http://localhost:8000/api/addcourse/'),
//                     axios.get('http://localhost:8000/api/staff/'),
//                     axios.get('http://localhost:8000/api/addsession/')
//                 ]);

//                 setSubjects(subjectsRes.data);
//                 setCourses(coursesRes.data);
//                 setStaff(staffRes.data);
//                 setSessions(sessionsRes.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setError('Error fetching data');
//                 toast.error('Error fetching data. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // Deleting a subject
//     const handleDelete = async (subjectId) => {
//         if (!window.confirm("Are you sure you want to delete this subject?")) return;
//         setLoading(true);
//         try {
//             await axios.delete(`http://localhost:8000/api/addsub/${subjectId}/`);
//             setSubjects(subjects.filter(subject => subject.id !== subjectId));
//             toast.success("Subject deleted successfully");
//         } catch (error) {
//             console.error('Error deleting subject:', error);
//             toast.error('Error deleting subject');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Adding a new subject
//     const handleAddSubject = async (e) => {
//         e.preventDefault();
//         setError('');
//         setLoading(true);

//         if (!subjectName || !selectedStaff || !selectedCourse || !selectedSession) {
//             setError('All fields are required');
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:8000/api/addsub/', {
//                 name: subjectName,
//                 course: selectedCourse,
//                 staff: selectedStaff,
//                 session: selectedSession
//             });
//             setSubjects([...subjects, response.data]);
//             toast.success('Subject added successfully!');
//             setShowAddModal(false);
//             resetFormFields();
//         } catch (error) {
//             console.error('Error adding subject:', error);
//             setError('Error adding subject. Please try again.');
//             toast.error('Error adding subject. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Opening edit modal with selected subject details
//     const handleEdit = (subject) => {
//         setEditSubject(subject);
//         setSelectedCourse(subject.course); // Set selected course for editing
//         setSelectedStaff(subject.staff); // Set selected staff for editing
//         setSelectedSession(subject.session); // Set selected session for editing
//         setShowEditModal(true);
//     };

//     // Updating a subject
//     const handleUpdate = async () => {
//         setLoading(true);
//         if (!editSubject.name || !selectedCourse || !selectedStaff || !selectedSession) {
//             setError("All fields are required for updating.");
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.put(`http://localhost:8000/api/addsub/${editSubject.id}/`, {
//                 name: editSubject.name,
//                 course: selectedCourse,
//                 staff: selectedStaff,
//                 session: selectedSession // Include session in the update
//             });
//             setSubjects(subjects.map(subject => subject.id === editSubject.id ? { ...subject, ...response.data } : subject));
//             toast.success('Subject updated successfully!');
//             setShowEditModal(false);
//         } catch (error) {
//             console.error('Error updating subject:', error);
//             setError('Error updating subject');
//             toast.error('Error updating subject. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetFormFields = () => {
//         setSubjectName('');
//         setSelectedStaff('');
//         setSelectedCourse('');
//         setSelectedSession('');
//         setError('');
//     };

//     return (
//         <div>
//             <Titile />
//             <div className='d-lg-flex d-md-block d-sm-block'>
//                 <AdminSideNav />
//                 <div className="dash flex-grow-1 p-3">
//                     <h2>Manage Subjects</h2>
//                     <Button className='bttn px-5' onClick={() => { setShowAddModal(true); resetFormFields(); }}>Add Subject</Button>
                    
//                     <div className='dash-container mt-3'>
//                         <Card className="mt-3" style={{ width: '100%' }}>
//                             <Card.Body>
//                                 {loading ? (
//                                     <Spinner animation="border" variant="primary" />
//                                 ) : (
//                                     <Table bordered striped hover>
//                                         <thead>
//                                             <tr>
//                                                 <th>Sno</th>
//                                                 <th>Subject Name</th>
//                                                 <th>Course</th>
//                                                 <th>Staff</th>
//                                                 <th>Session</th>
//                                                 <th>Edit</th>
//                                                 <th>Delete</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {subjects.map((subject, index) => (
//                                                 <tr key={index}>
//                                                     <td>{index + 1}</td>
//                                                     <td>{subject.name}</td>
//                                                     <td>{subject.course_name}</td>
//                                                     <td>{subject.staff_name}</td>
//                                                     <td>{subject.session_start} - {subject.session_end}</td>
//                                                     <td><Button onClick={() => handleEdit(subject)}>Edit</Button></td>
//                                                     <td><Button variant='danger' onClick={() => handleDelete(subject.id)}>Delete</Button></td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </div>
//                 </div>
//             </div>

//             {/* Add Subject Modal */}
//             <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add Subject</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleAddSubject}>
//                         <Form.Group>
//                             <Form.Label>Subject Name:</Form.Label>
//                             <Form.Control
//                                 type='text'
//                                 value={subjectName}
//                                 onChange={(e) => setSubjectName(e.target.value)}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Course:</Form.Label>
//                             <Form.Select
//                                 value={selectedCourse}
//                                 onChange={(e) => setSelectedCourse(e.target.value)}
//                                 required
//                             >
//                                 <option value="">-- Select Course --</option>
//                                 {courses.map(course => (
//                                     <option key={course.id} value={course.id}>{course.name}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Staff:</Form.Label>
//                             <Form.Select
//                                 value={selectedStaff}
//                                 onChange={(e) => setSelectedStaff(e.target.value)}
//                                 required
//                             >
//                                 <option value="">-- Select Staff --</option>
//                                 {staff.map(staffMember => (
//                                     <option key={staffMember.id} value={staffMember.id}>{staffMember.staff_name}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Session:</Form.Label>
//                             <Form.Select
//                                 value={selectedSession}
//                                 onChange={(e) => setSelectedSession(e.target.value)}
//                                 required
//                             >
//                                 <option value="">-- Select Session --</option>
//                                 {sessions.map(session => (
//                                     <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                         {error && <Alert variant="danger">{error}</Alert>}
//                         <Button variant="primary" type="submit" disabled={loading}>
//                             {loading ? 'Adding...' : 'Add Subject'}
//                         </Button>
//                     </Form>
//                 </Modal.Body>
//             </Modal>

//             {/* Edit Subject Modal */}
//             <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Subject</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleUpdate}>
//                         <Form.Group>
//                             <Form.Label>Subject Name:</Form.Label>
//                             <Form.Control
//                                 type='text'
//                                 value={editSubject.name}
//                                 onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Course:</Form.Label>
//                             <Form.Select
//                                 value={selectedCourse}
//                                 onChange={(e) => setSelectedCourse(e.target.value)}
//                                 required
//                             >
//                                 <option value="">-- Select Course --</option>
//                                 {courses.map(course => (
//                                     <option key={course.id} value={course.id}>{course.name}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Staff:</Form.Label>
//                             <Form.Select
//                                 value={selectedStaff}
//                                 onChange={(e) => setSelectedStaff(e.target.value)}
//                                 required
//                             >
//                                 <option value="">-- Select Staff --</option>
//                                 {staff.map(staffMember => (
//                                     <option key={staffMember.id} value={staffMember.id}>{staffMember.staff_name}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                         <Form.Group>
//                             <Form.Label>Session:</Form.Label>
//                             <Form.Select
//                                 value={selectedSession}
//                                 onChange={(e) => setSelectedSession(e.target.value)}
//                                 required
//                             >
//                                 <option value="">-- Select Session --</option>
//                                 {sessions.map(session => (
//                                     <option key={session.id} value={session.id}>{session.start_year} - {session.end_year}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
//                         {error && <Alert variant="danger">{error}</Alert>}
//                         <Button variant="primary" type="submit" disabled={loading}>
//                             {loading ? 'Updating...' : 'Update Subject'}
//                         </Button>
//                     </Form>
//                 </Modal.Body>
//             </Modal>
//             <ToastContainer />
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default ManageSubject;
