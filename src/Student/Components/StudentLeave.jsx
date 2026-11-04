import React, { useState, useEffect } from "react";
import Titile from "../../Home/Components/Titile";
import { Form, Card, Button, Table, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const StuLeave = () => {
  const [fromdate, setFromDate] = useState("");
  const [todate, settodate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Spinner for API calls
  const [leaveReports, setLeaveReports] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchLeaveReports = async () => {
      setLoading(true);
      try {
        const cleanEmail = email.replace(/^"|"$/g, ""); // Clean up email string
        const response = await axios.get(
          `http://localhost:8000/api/stuleave/${cleanEmail}/`
        );

        if (response.status === 200) {
          setLeaveReports(response.data); // Set the leave reports in state
        }
      } catch (error) {
        toast.error("Error fetching leave reports");
        console.error("Error fetching leave reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveReports();
    const cleanEmail = email.replace(/^"|"$/g, ""); // Clean up email string

    const ws = new WebSocket(
      `ws://localhost:8000/ws/student_leave_update/${cleanEmail}/`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      toast.info("Your Leave Request has been updated");
      fetchLeaveReports();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [email]);
  const fetchLeaveReports = async () => {
    setLoading(true);
    try {
      const cleanEmail = email.replace(/^"|"$/g, ""); // Clean up email string
      const response = await axios.get(
        `http://localhost:8000/api/stuleave/${cleanEmail}/`
      );

      if (response.status === 200) {
        setLeaveReports(response.data); // Set the leave reports in state
      }
    } catch (error) {
      toast.error("Error fetching leave reports");
      console.error("Error fetching leave reports:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = email.replace(/^"|"$/g, ""); // Remove quotes if any
      const leaveApplication = {
        student_email: cleanEmail,
        fromdate,
        todate,
        message,
      };

      const response = await axios.post(
        "http://localhost:8000/api/stuleave/",
        leaveApplication
      );

      if (response.status === 200) {
        toast.success("Leave application submitted successfully");
        setFromDate("");
        settodate("");
        setMessage("");
        fetchLeaveReports();
      } else {
        toast.error("Failed to submit leave application");
      }
    } catch (error) {
      console.error("Error submitting leave application:", error);
      toast.error("An error occurred while submitting the leave application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">

        <div className="dash flex-grow-1 p-3">
          <div className="dash-container d-flex flex-column align-items-center">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "90%" }}
            >
              <Card.Header>
                <Card.Title>Leave Application</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>From :</Form.Label>
                    <Form.Control
                      type="date"
                      value={fromdate}
                      onChange={(e) => setFromDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>To :</Form.Label>
                    <Form.Control
                      type="date"
                      value={todate}
                      onChange={(e) => settodate(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Message :</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
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
                </Form>
              </Card.Body>
            </Card>
            <Card className="mt-3" style={{ width: "100%" }}>
              <Card.Header>
                <Card.Title>Leave History</Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <Spinner animation="border" variant="primary" />
                ) : leaveReports.length > 0 ? (
                  <div className="feedback-cards container">
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
                            {report.fromdate} to {report.todate}
                            </Card.Subtitle>
                          </div>
                          <div>
                            <b>({report.status})</b>
                          </div>
                        </div>
                        <Card.Text style={{ fontSize: "18px" }}>
                          <div>
                            <br />
                            {report.message}
                          </div>
                        </Card.Text>
                        <div className="d-flex flex-row-reverse">
                          <br />
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
    </div>
  );
};

export default StuLeave;
