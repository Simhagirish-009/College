// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Title from "../../Home/Components/Titile";
import StaffSideNav from "./StaffSideBar";
import { Form, Card, Button,Spinner } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaperPlane } from "react-icons/fa";

const StaffFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [feedbackReports, setFeedbackReports] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const email = localStorage.getItem("email");

  // Fetch feedback reports when the component mounts
  useEffect(() => {
    const fetchFeedbackReports = async () => {
      setLoading(true); // Start loading
      try {
        const cleanEmail = email.replace(/^"|"$/g, "");
        const response = await axios.get(
          `http://localhost:8000/api/stafffeedback/${cleanEmail}/`
        );

        if (response.status === 200) {
          setFeedbackReports(response.data);
        }
      } catch (error) {
        console.error("Error fetching feedback reports:", error);
        toast.error("Error fetching feedback reports"); // Show toast notification
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFeedbackReports();
    // const cleanEmail = email.replace(/^"|"$/g, "");
    // const ws = new WebSocket(
    //   `ws://localhost:8000/ws/staff_feedback_reply/${cleanEmail}/`
    // );

    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   fetchFeedbackReports();
    //   toast.info(`Reply : ${data.reply}`);
    // };

    // ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    // };

    // return () => {
    //   ws.close();
    // };
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const cleanEmail = email.replace(/^"|"$/g, "");
      const feedbackSubmission = {
        staff_email: cleanEmail,
        feedback,
      };

      // API call to send feedback
      const response = await axios.post(
        "http://localhost:8000/api/stafffeedback/",
        feedbackSubmission
      );

      if (response.status === 201) {
        toast.success("Feedback submitted successfully"); // Show success toast
        setFeedback("");
        // Fetch updated feedback reports
        const updatedReports = await axios.get(
          `http://localhost:8000/api/stafffeedback/${cleanEmail}/`
        );
        setFeedbackReports(updatedReports.data);
      } else {
        toast.error("Failed to submit feedback"); // Show error toast
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred while submitting the feedback"); // Show error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <div>
      <Title />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Send Feedback to Admin</h2>

          <div className="dash-container d-flex flex-column align-items-center">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "90%" }}
            >
              <Card.Header>
                <Card.Title>Submit Feedback</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Feedback :</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <br />
                  <Form.Group className="form-group justify-content-center d-flex">
                    <Button
                      className="px-5 py-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <span><FaPaperPlane/> Send</span>
                      )}
                    </Button>
                  </Form.Group>
                  <br />
                </Form>
              </Card.Body>
            </Card>

            <Card className="mt-3" style={{ width: "90%" }}>
              <Card.Header>
                <Card.Title>Feedback History</Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? ( // Show spinner while loading
                  <Spinner animation="border" variant="primary" />
                ) : feedbackReports.length > 0 ? (
                  <div className="feedback-cards container">
                    {feedbackReports.map((report, index) => (
                      <Card
                        key={index}
                        className="mb-3 shadow-sm"
                        style={{ width: "100%", backgroundColor: "#e9f0fc" }}
                      >
                        <Card.Body>
                          <div className="d-flex flex-row-reverse">
                            <div></div>
                            <Card
                              className="px-3 py-2 shadow-sm"
                              style={{ width: "40%" }}
                            >
                              <Card.Title
                                className="text-muted"
                                style={{ fontSize: "15px" }}
                              >
                                From {report.staff_name}
                              </Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">
                                {new Date(report.created_at).toLocaleString()}
                              </Card.Subtitle>
                              <Card.Text style={{ fontSize: "20px" }}>
                                {report.feedback}
                              </Card.Text>
                            </Card>
                          </div>
                          <Card
                            className="px-3 py-2 shadow-sm"
                            style={{ width: "40%" }}
                          >
                            <Card.Text>
                              <Card.Title
                                className="text-muted"
                                style={{ fontSize: "15px" }}
                              >
                                From Admin
                              </Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">
                                {new Date(report.updated_at).toLocaleString()}
                              </Card.Subtitle>
                              <p style={{ fontSize: "20px" }}>
                                {report.reply || "no reply"}
                              </p>
                            </Card.Text>
                          </Card>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No leave Feedback Reports found.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
// =======
// import React, { useState, useEffect } from 'react';
// import Title from '../../Home/Components/Titile';
// import StaffSideNav from './StaffSideBar';
// import { Form, Card, Button, Table, Spinner } from 'react-bootstrap';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const StaffFeedback = () => {
//     const [feedback, setFeedback] = useState('');
//     const [feedbackReports, setFeedbackReports] = useState([]);
//     const [loading, setLoading] = useState(false); // Loading state
//     const email = localStorage.getItem('email');

//     // Fetch feedback reports when the component mounts
//     useEffect(() => {
//         const fetchFeedbackReports = async () => {
//             setLoading(true); // Start loading
//             try {
//                 const cleanEmail = email.replace(/^"|"$/g, '');
//                 const response = await axios.get(`http://localhost:8000/api/stafffeedback/${cleanEmail}/`);
                
//                 if (response.status === 200) {
//                     setFeedbackReports(response.data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching feedback reports:', error);
//                 toast.error('Error fetching feedback reports'); // Show toast notification
//             } finally {
//                 setLoading(false); // Stop loading
//             }
//         };

//         fetchFeedbackReports();
//     }, [email]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true); // Start loading

//         try {
//             const cleanEmail = email.replace(/^"|"$/g, '');
//             const feedbackSubmission = {
//                 staff_email: cleanEmail,
//                 feedback,
//             };

//             // API call to send feedback
//             const response = await axios.post('http://localhost:8000/api/stafffeedback/', feedbackSubmission);

//             if (response.status === 201) {
//                 toast.success('Feedback submitted successfully'); // Show success toast
//                 setFeedback('');
//                 // Fetch updated feedback reports
//                 const updatedReports = await axios.get(`http://localhost:8000/api/stafffeedback/${cleanEmail}/`);
//                 setFeedbackReports(updatedReports.data);
//             } else {
//                 toast.error('Failed to submit feedback'); // Show error toast
//             }
//         } catch (error) {
//             console.error('Error submitting feedback:', error);
//             toast.error('An error occurred while submitting the feedback'); // Show error toast
//         } finally {
//             setLoading(false); // Stop loading
//         }
//     };
//     return (
//         <div>
//             <Title />
//             <div className="d-lg-flex d-md-block d-sm-block ">
//                 <StaffSideNav />
//                 <div className="dash flex-grow-1 p-3">
//                     <div className="dash-container d-flex flex-column align-items-center">
//                         <Card className="animate__animated animate__fadeIn mt-2" style={{ width: '90%' }}>
//                             <Card.Header>
//                                 <Card.Title>Submit Feedback</Card.Title>
//                             </Card.Header>
//                             <Card.Body>
//                                 <Form onSubmit={handleSubmit}>
//                                     <Form.Group>
//                                         <Form.Label>Feedback :</Form.Label>
//                                         <Form.Control
//                                             as="textarea"
//                                             rows={6}
//                                             value={feedback}
//                                             onChange={(e) => setFeedback(e.target.value)}
//                                             required
//                                         />
//                                     </Form.Group>
//                                     <br />
//                                     <Form.Group className="form-group justify-content-center d-flex">
//                                         <Button className="px-5 py-2" type="submit" disabled={loading}>
//                                             {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
//                                         </Button>
//                                     </Form.Group>
//                                     <br />
//                                 </Form>
//                             </Card.Body>
//                         </Card>

//                         <Card className="mt-3" style={{ width: '100%' }}>
//                             <Card.Header>
//                                 <Card.Title>Feedback History</Card.Title>
//                             </Card.Header>
//                             <Card.Body>
//                                 {loading ? (
//                                     <Spinner animation="border" />
//                                 ) : feedbackReports.length > 0 ? (
//                                     <Table striped bordered hover>
//                                         <thead>
//                                             <tr>
//                                                 <th>Sno</th>
//                                                 <th>Feedback</th>
//                                                 <th>Reply</th>
//                                                 <th>Date</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {feedbackReports.map((report, index) => (
//                                                 <tr key={index}>
//                                                     <td>{index + 1}</td>
//                                                     <td>{report.feedback}</td>
//                                                     <td>{report.reply ? report.reply : 'No reply yet'}</td>
//                                                     <td>{new Date(report.created_at).toLocaleDateString()}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>
//                                 ) : (
//                                     <p>No feedback reports found.</p>
//                                 )}
//                             </Card.Body>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//             <ToastContainer /> {/* Toast container for notifications */}
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default StaffFeedback;
