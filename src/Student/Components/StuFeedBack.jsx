// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Form, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Title from "../../Home/Components/Titile";
import StudentSideNav from "./StudentSideNav";
const StuFeed = () => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [feedbackReports, setFeedbackReports] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const email = localStorage.getItem("email");

  // Fetch feedback reports when the component mounts
  useEffect(() => {
    const fetchFeedbackReports = async () => {
      try {
        setLoading(true); // Start loading spinner
        const cleanEmail = email.replace(/^"|"$/g, "");
        const response = await axios.get(
          `http://localhost:8000/api/stufeedback/${cleanEmail}/`
        );

        if (response.status === 200) {
          setFeedbackReports(response.data);
        }
      } catch (error) {
        console.error("Error fetching feedback reports:", error);
        toast.error("Error fetching feedback reports");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchFeedbackReports();
    // const cleanEmail = email.replace(/^"|"$/g, "");
    // const ws = new WebSocket(
    //   `ws://localhost:8000/ws/student_feedback_reply/${cleanEmail}/`
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
    setLoading(true); // Start loading spinner

    try {
      const cleanEmail = email.replace(/^"|"$/g, "");
      const feedbackSubmission = { student_email: cleanEmail, feedback };

      const response = await axios.post(
        "http://localhost:8000/api/stufeedback/",
        feedbackSubmission
      );

      if (response.status === 201) {
        setSuccess("Feedback submitted successfully");
        setFeedback("");
        setError("");
        toast.success("Feedback submitted successfully");
        // Fetch updated feedback reports
        const updatedReports = await axios.get(
          `http://localhost:8000/api/stufeedback/${cleanEmail}/`
        );
        setFeedbackReports(updatedReports.data);
      } else {
        setError("Failed to submit feedback");
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("An error occurred while submitting the feedback");
      toast.error("An error occurred while submitting the feedback");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div>
      <Title />
      <div className="d-lg-flex d-md-block d-sm-block ">
        <StudentSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container d-flex flex-column align-items-center">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "90%" }}
            >
              <Card.Header>
                <Card.Title>Complaint Box</Card.Title>
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
                        "Submit"
                      )}
                    </Button>
                  </Form.Group>
                  <br />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {success && <p style={{ color: "green" }}>{success}</p>}
                </Form>
              </Card.Body>
            </Card>

            <Card className="mt-3" style={{ width: "90%" }}>
              <Card.Header>
                <Card.Title>Previous Complaints</Card.Title>
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
                                To {report.staff_name}
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
                  <p>No leave requests found.</p>
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

export default StuFeed;
