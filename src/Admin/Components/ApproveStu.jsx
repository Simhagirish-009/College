// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideNav from "./AdminSideNav";
import Title from "../../Home/Components/Titile";
import { Button, Card, Modal, Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import "../../App.css";
import { FaPaperPlane , FaReply } from "react-icons/fa";
const ApproveStu = () => {
  const [leaveReports, setLeaveReports] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for data fetching

  // Fetch leave reports when the component mounts
  useEffect(() => {
    const fetchLeaveReports = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          "http://localhost:8000/api/stu_leave_request/"
        ); // Update the URL to match your API endpoint
        if (response.status === 200) {
          setLeaveReports(response.data); // Set the leave reports in state
        }
      } catch (error) {
        console.error("Error fetching leave reports:", error);
        setError("An error occurred while fetching leave reports.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchLeaveReports();
    // const socket = new WebSocket(
    //   "ws://127.0.0.1:8000/ws/student_leave_requests/"
    // );

    // socket.onopen = () => console.log("WebSocket Connected");

    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   toast.info(data.message); // Show notification
    //   fetchLeaveReports();
    // };

    // socket.onerror = (error) => console.error("WebSocket Error:", error);

    // socket.onclose = (event) => console.log("WebSocket Closed:", event);

    // return () => socket.close();
  }, []);

  // Handle opening modal when clicking "Reply"
  const handleReplyClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  // Handle dropdown change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Handle form submission for approving or rejecting
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchLeaveReports = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          "http://localhost:8000/api/stu_leave_request/"
        ); // Update the URL to match your API endpoint
        if (response.status === 200) {
          setLeaveReports(response.data); // Set the leave reports in state
        }
      } catch (error) {
        console.error("Error fetching leave reports:", error);
        setError("An error occurred while fetching leave reports.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    setLoading(true); // Set loading to true before updating
    try {
      await axios.put(
        `http://localhost:8000/api/stu_leave_request/${selectedReport.id}/`,
        { status }
      ); // Update the URL to match your API endpoint
      setShowModal(false); // Close modal after updating status
      setStatus(""); // Reset dropdown
      setSelectedReport(null); // Clear selected report
      fetchLeaveReports();
      toast.success("Leave request status updated successfully!"); // Show success toast
      // Optionally, refetch the updated data or update the state to reflect changes
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Error updating leave status."); // Show error toast
    } finally {
      setLoading(false); // Set loading to false after updating
    }
  };

  return (
    <div className="root">
      <Title />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Leave Requests (Student) </h2>
          <div className="dash-container">
            <Card
              className="mt-3 animate__animated animate__fadeIn"
              style={{ width: "100%" }}
            >
              <Card.Header>
                <Card.Title>Leave Requests</Card.Title>
              </Card.Header>
              <Card.Body>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {loading ? (
                  <Spinner animation="border" variant="primary" />
                ) : leaveReports.length > 0 ? (
                  <div className="feedback-cards container animate__animated animate__fadeIn">
                    {leaveReports.map((report, index) => (
                      <Card
                        className="px-3 py-2 mt-3 shadow-md"
                        style={{
                          width: "100%",
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <div className="d-flex container justify-content-between">
                          <div style={{ marginLeft: "-10px" }}>
                            <Card.Title
                              className="text-muted"
                              style={{ fontSize: "15px" }}
                            >
                              From {report.student_name}
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {report.year} {report.course}
                            </Card.Subtitle>
                          </div>
                          <div>
                            <b>({report.status})</b>
                          </div>
                        </div>
                        <Card.Text style={{ fontSize: "18px" }}>
                          <div>
                            <br />
                            {report.message}<br/><br/>
                            from {report.fromdate} to {report.todate}
                          </div>
                        </Card.Text>
                        <div className="d-flex flex-row-reverse">
                          <br />

                          <Button
                            className="px-5"
                            disabled={report.status !== "pending"}
                            variant="primary"
                            style={{
                              display:
                                report.status !== "pending" ? "none" : "block",
                            }}
                            onClick={() => handleReplyClick(report)}
                          >
                            <FaReply /> Reply
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No leave requests found.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      {/* Modal for approving/rejecting leave request */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Respond to Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={handleStatusChange}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </Form.Control>
            </Form.Group>
            <br />
            <Form.Group className="d-flex justify-content-center btnn">
              <Button className="bttn px-5" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <span>
                    <FaPaperPlane /> Send
                  </span>
                )}
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
// =======
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AdminSideNav from './AdminSideNav';
// import Title from '../../Home/Components/Titile';
// import { Button, Card, Table, Modal, Form, Spinner } from 'react-bootstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
// import '../../App.css';

// const ApproveStu = () => {
//     const [leaveReports, setLeaveReports] = useState([]);
//     const [error, setError] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [status, setStatus] = useState('');
//     const [loading, setLoading] = useState(false); // Loading state for data fetching

//     // Fetch leave reports when the component mounts
//     useEffect(() => {
//         const fetchLeaveReports = async () => {
//             setLoading(true); // Set loading to true before fetching
//             try {
//                 const response = await axios.get('http://localhost:8000/api/stuapprove/'); // Update the URL to match your API endpoint
//                 if (response.status === 200) {
//                     setLeaveReports(response.data); // Set the leave reports in state
//                 }
//             } catch (error) {
//                 console.error('Error fetching leave reports:', error);
//                 setError('An error occurred while fetching leave reports.');
//             } finally {
//                 setLoading(false); // Set loading to false after fetching
//             }
//         };

//         fetchLeaveReports();
//     }, []);

//     // Handle opening modal when clicking "Reply"
//     const handleReplyClick = (report) => {
//         setSelectedReport(report);
//         setShowModal(true);
//     };

//     // Handle dropdown change
//     const handleStatusChange = (e) => {
//         setStatus(e.target.value);
//     };

//     // Handle form submission for approving or rejecting
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true); // Set loading to true before updating
//         try {
//             await axios.put(`http://localhost:8000/api/stuapprove/${selectedReport.id}/`, { status }); // Update the URL to match your API endpoint
//             setShowModal(false); // Close modal after updating status
//             setStatus(''); // Reset dropdown
//             setSelectedReport(null); // Clear selected report
//             toast.success('Leave request status updated successfully!'); // Show success toast
//             // Optionally, refetch the updated data or update the state to reflect changes
//         } catch (error) {
//             console.error('Error updating leave status:', error);
//             toast.error('Error updating leave status.'); // Show error toast
//         } finally {
//             setLoading(false); // Set loading to false after updating
//         }
//     };

//     return (
//         <div>
//             <Title />
//             <div className='d-lg-flex d-md-block d-sm-block'>
//                 <AdminSideNav />
//                 <div className="dash flex-grow-1 p-3">
//                     <div className='dash-container'>
//                         <Card className="mt-3" style={{ width: '100%' }}>
//                             <Card.Header>
//                                 <Card.Title>Leave Requests</Card.Title>
//                             </Card.Header>
//                             <Card.Body>
//                                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                                 {loading ? (
//                                     <Spinner animation="border" variant="primary" />
//                                 ) : leaveReports.length > 0 ? (
//                                     <Table striped bordered hover>
//                                         <thead>
//                                             <tr>
//                                                 <th>Student Name</th>
//                                                 <th>Date</th>
//                                                 <th>Message</th>
//                                                 <th>Status</th>
//                                                 <th>Action</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {leaveReports.map((report, index) => (
//                                                 <tr key={index}>
//                                                     <td>{report.student_name}</td> {/* Ensure you have a student_name field */}
//                                                     <td>{report.date}</td>
//                                                     <td>{report.message}</td>
//                                                     <td>{report.status}</td>
//                                                     <td>
//                                                         <Button variant='success' onClick={() => handleReplyClick(report)}>
//                                                             Reply
//                                                         </Button>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>
//                                 ) : (
//                                     <p>No leave requests found.</p>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </div>
//                 </div>
//             </div>

//             {/* Modal for approving/rejecting leave request */}
//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Respond to Leave Request</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group>
//                             <Form.Label>Status</Form.Label>
//                             <Form.Control as="select" value={status} onChange={handleStatusChange} required>
//                                 <option value="">-- Select Status --</option>
//                                 <option value="approved">Approve</option>
//                                 <option value="rejected">Reject</option>
//                             </Form.Control>
//                         </Form.Group>
//                         <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
//                             {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
//                         </Button>
//                     </Form>
//                 </Modal.Body>
//             </Modal>

//             <ToastContainer /> {/* Toast notifications container */}
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default ApproveStu;
