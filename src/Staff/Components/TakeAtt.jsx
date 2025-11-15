// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Titile from "../../Home/Components/Titile";
import StaffSideNav from "./StaffSideBar";
import { Form, Card, Button, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TakeAtt = () => {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [session, setSession] = useState("");
  const date = new Date().toISOString().split("T")[0];
  const [fetchStudents, setFetchStudents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addsession/"
        );
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

  useEffect(() => {
    if (fetchStudents) {
      const fetchStudentList = async () => {
        setLoading(true);
        try {
          const cleanedEmail = email.replace(/^"|"$/g, "");
          const response = await axios.get(
            `http://localhost:8000/api/stu_fetch/?email=${cleanedEmail}&session=${session}`
          );
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
          toast.error("Error fetching students");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentList();
    }
  }, [fetchStudents, session, subject]);

  const handleStatusChange = (studentId) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [studentId]: !prevStatus[studentId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const allStatuses = {};
    students.forEach((student) => {
      allStatuses[student.id] = selectedStatus[student.id] || false;
    });

    try {
      const response = await axios.post("http://localhost:8000/api/takeatt/", {
        session,
        subject,
        date,
        statuses: allStatuses,
      });
      toast.success("Attendance taken successfully");
      setFetchStudents(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Unit already existed";
      toast.error(errorMessage);
      console.error("Error taking attendance:", error);
      // toast.error("Error taking attendance");
    } finally {
      setLoading(false);
    }
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
                      onClick={() => setFetchStudents(true)}
                    >
                      Fetch Students
                    </Button>
                  </Form.Group>

                  {students.length > 0 && (
                    <>
                      <br />
                      <Form.Group>
                        <Form.Label>Date:</Form.Label>
                        <Form.Control type="date" value={date} readOnly />
                      </Form.Group>
                      <br />
                      <Table bordered striped>
                        <thead>
                          <tr>
                            <th>Sno</th>
                            <th>Student</th>
                            <th style={{ textAlign: "center" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((stu, index) => (
                            <tr key={stu.id} value={stu.id}>
                              <td>{index + 1}</td>
                              <td>{stu.pin}</td>
                              <td style={{ textAlign: "center" }}>
                                <Form.Check
                                  type="checkbox"
                                  checked={selectedStatus[stu.id] || false}
                                  onChange={() => handleStatusChange(stu.id)}
                                  style={{ fontSize: "20px" }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      <br />
                      <Button className="px-5 py-2" type="submit">
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save Attendance"
                        )}
                      </Button>
                    </>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  // =======
  // import React, { useState, useEffect } from 'react';
  // import Titile from '../../Home/Components/Titile';
  // import StaffSideNav from './StaffSideBar';
  // import { Form, Card, Button, Spinner, Table } from 'react-bootstrap';
  // import axios from 'axios';
  // import { ToastContainer, toast } from 'react-toastify';
  // import 'react-toastify/dist/ReactToastify.css';

  // const TakeAtt = () => {
  //     const [subjects, setSubjects] = useState([]);
  //     const [sessions, setSessions] = useState([]);
  //     const [students, setStudents] = useState([]);
  //     const [subject, setSubject] = useState('');
  //     const [session, setSession] = useState('');
  //     const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  //     const [fetchStudents, setFetchStudents] = useState(false);
  //     const [loading, setLoading] = useState(false);
  //     const [selectedStatus, setSelectedStatus] = useState({});
  //     const email = localStorage.getItem('email');

  //     useEffect(() => {
  //         const fetchSessions = async () => {
  //             setLoading(true);
  //             try {
  //                 const response = await axios.get('http://localhost:8000/api/addsession/');
  //                 setSessions(response.data);
  //             } catch (error) {
  //                 console.error("Error fetching sessions:", error);
  //                 toast.error('Error fetching sessions');
  //             } finally {
  //                 setLoading(false);
  //             }
  //         };
  //         fetchSessions();
  //     }, [email]);

  //     useEffect(() => {
  //         const fetchSubjects = async () => {
  //             if (!session) return;
  //             setLoading(true);
  //             try {
  //                 const cleanedEmail = email.replace(/^"|"$/g, '');
  //                 const response = await axios.get(`http://localhost:8000/api/addsub/?session=${session}&email=${cleanedEmail}`);
  //                 setSubjects(response.data);
  //             } catch (error) {
  //                 console.error('Error fetching subjects:', error);
  //                 toast.error('Error fetching subjects');
  //             } finally {
  //                 setLoading(false);
  //             }
  //         };
  //         fetchSubjects();
  //     }, [session, email]);

  //     useEffect(() => {
  //         if (fetchStudents) {
  //             const fetchStudentList = async () => {
  //                 setLoading(true);
  //                 try {
  //                     const cleanedEmail = email.replace(/^"|"$/g, '');
  //                     const response = await axios.get(`http://localhost:8000/api/result_stu/?email=${cleanedEmail}&session=${session}`);
  //                     setStudents(response.data.student);
  //                 } catch (error) {
  //                     console.error("Error fetching students:", error);
  //                     toast.error('Error fetching students');
  //                 } finally {
  //                     setLoading(false);
  //                 }
  //             };
  //             fetchStudentList();
  //         }
  //     }, [fetchStudents, session, subject]);

  //     const handleStatusChange = (studentId) => {
  //         setSelectedStatus((prevStatus) => ({
  //             ...prevStatus,
  //             [studentId]: !prevStatus[studentId]
  //         }));
  //     };

  //     const handleSubmit = async (e) => {
  //         e.preventDefault();
  //         setLoading(true);

  //         const allStatuses = {};
  //         students.forEach(student => {
  //             allStatuses[student.id] = selectedStatus[student.id] || false;
  //         });

  //         try {
  //             const response = await axios.post('http://localhost:8000/api/takeatt/', {
  //                 session,
  //                 subject,
  //                 date,
  //                 statuses: allStatuses,
  //             });
  //             toast.success('Attendance taken successfully');
  //             setFetchStudents(false);
  //         } catch (error) {
  //             console.error('Error taking attendance:', error);
  //             toast.error('Error taking attendance');
  //         } finally {
  //             setLoading(false);
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
  //                                 <Form onSubmit={handleSubmit}>
  //                                     <Form.Group>
  //                                         <Form.Label>Select Session:</Form.Label>
  //                                         <Form.Select value={session} onChange={(e) => setSession(e.target.value)} required>
  //                                             <option value="">-- Select Session Year --</option>
  //                                             {sessions.map(session => (
  //                                                 <option key={session.id} value={session.id}>
  //                                                     {session.start_year} - {session.end_year}
  //                                                 </option>
  //                                             ))}
  //                                         </Form.Select>
  //                                     </Form.Group>

  //                                     <Form.Group>
  //                                         <Form.Label>Select Subject:</Form.Label>
  //                                         <Form.Select value={subject} onChange={(e) => setSubject(e.target.value)} required>
  //                                             <option value="">-- Select Subject --</option>
  //                                             {subjects.map(subject => (
  //                                                 <option key={subject.id} value={subject.id}>
  //                                                     {subject.name}
  //                                                 </option>
  //                                             ))}
  //                                         </Form.Select>
  //                                     </Form.Group>
  //                                     <br />
  //                                     <Form.Group className="form-group justify-content-center d-flex">
  //                                         <Button className="px-5 py-2" type="button" onClick={() => setFetchStudents(true)}>Fetch Students</Button>
  //                                     </Form.Group>

  //                                     {students.length > 0 && (
  //                                         <>
  //                                             <br/>
  //                                             <Form.Group>
  //                                                 <Form.Label>Date:</Form.Label>
  //                                                 <Form.Control
  //                                                     type='date'
  //                                                     value={date}
  //                                                     onChange={(e) => setDate(e.target.value)}
  //                                                     required
  //                                                 />
  //                                             </Form.Group>
  //                                             <br/>
  //                                             <Table>
  //                                                 <thead>
  //                                                     <tr>
  //                                                         <th>Sno</th>
  //                                                         <th>Student</th>
  //                                                         <th>Status</th>
  //                                                     </tr>
  //                                                 </thead>
  //                                                 <tbody>
  //                                                     {students.map((stu, index) => (
  //                                                         <tr key={stu.id} value={stu.id}>
  //                                                             <td>{index + 1}</td>
  //                                                             <td>{stu.student_name}</td>
  //                                                             <td>
  //                                                                 <Form.Check
  //                                                                     type="checkbox"
  //                                                                     checked={selectedStatus[stu.id] || false}
  //                                                                     onChange={() => handleStatusChange(stu.id)}
  //                                                                 />
  //                                                             </td>
  //                                                         </tr>
  //                                                     ))}
  //                                                 </tbody>
  //                                             </Table>

  //                                             <br />
  //                                             <Button className="px-5 py-2" type="submit">
  //                                                 {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
  //                                             </Button>
  //                                         </>
  //                                     )}
  //                                 </Form>
  //                             </Card.Body>
  //                         </Card>
  //                     </div>
  //                 </div>
  //             </div>
  //             <ToastContainer />
  //         </div>
  //     );
  // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default TakeAtt;
