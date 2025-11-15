// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { Button, Card, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import { FaPaperPlane, FaReply } from "react-icons/fa";

const FeedBackStu = () => {
  const [leaveReports, setLeaveReports] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaveReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/replystu/");
        if (response.status === 200) {
          setLeaveReports(response.data);
        }
      } catch (error) {
        console.error("Error fetching leave reports:", error);
        setError("An error occurred while fetching leave reports.");
        toast.error("Failed to fetch leave reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveReports();
    // const socket = new WebSocket("ws://127.0.0.1:8000/ws/student_feedback/");

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

  const handleReplyClick = (report) => {
    setSelectedReport(report);
    setReply(report.reply || "");
    setShowModal(true);
  };

  const handleStatusChange = (e) => {
    setReply(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/replystu/${selectedReport.id}/`,
        { reply }
      );
      if (response.status === 200) {
        setLeaveReports((prevReports) =>
          prevReports.map((report) =>
            report.id === selectedReport.id
              ? { ...report, reply: reply }
              : report
          )
        );
        setShowModal(false);
        setReply("");
        setSelectedReport(null);
        toast.success("Reply sent successfully!");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Failed to send reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Feedback Reports (Students)</h2>
          <br />
          <div className="dash-container">
            {loading ? (
              // Spinner while loading
              <Spinner animation="border" variant="primary" />
            ) : (
              <div className="feedback-cards container">
                <Card className="mb-3 shadow-sm" style={{ width: "100%" }}>
                  <Card.Header>
                    <Card.Title>Complaint Reports (Students)</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {error && (
                      <Alert variant="danger">
                        <p className="text-danger">{error}</p>
                      </Alert>
                    )}

                    {leaveReports.length > 0 ? (
                      <div className="feedback-cards container">
                        {leaveReports.map((report, index) => (
                          <Card
                            key={index}
                            className="mb-3 shadow-sm"
                            style={{
                              width: "100%",
                              backgroundColor: "#e9f0fc",
                              border: "none",
                            }}
                          >
                            <Card.Body>
                              <Card
                                className="px-3 py-2 shadow-sm"
                                style={{ width: "40%" }}
                              >
                                <Card.Title
                                  className="text-muted"
                                  style={{ fontSize: "15px" }}
                                >
                                  From {report.student_name} ({report.course},{" "}
                                  {report.year})
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                  {new Date(report.created_at).toLocaleString()}
                                </Card.Subtitle>
                                <Card.Text style={{ fontSize: "20px" }}>
                                  {report.feedback}
                                </Card.Text>
                              </Card>

                              <div className="d-flex flex-row-reverse">
                                <Card
                                  className="px-3 py-2 shadow-sm"
                                  style={{ width: "40%" }}
                                >
                                  <Card.Title
                                    className="text-muted"
                                    style={{ fontSize: "15px" }}
                                  >
                                    To {report.student_name}
                                  </Card.Title>
                                  <Card.Subtitle className="mb-2 text-muted">
                                    {new Date(
                                      report.updated_at
                                    ).toLocaleString()}
                                  </Card.Subtitle>
                                  <Card.Text style={{ fontSize: "20px" }}>
                                    {report.reply || " "}
                                  </Card.Text>
                                  <Button
                                    variant="primary"
                                    onClick={() => handleReplyClick(report)}
                                    style={{
                                      display:
                                        report.reply !== "No Reply"
                                          ? "none"
                                          : "block",
                                    }}
                                  >
                                    <FaReply /> Reply
                                  </Button>
                                </Card>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      // Message inside Card if no leave reports
                      <p> No leave requests found.</p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Respond to Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Reply Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                onChange={handleStatusChange}
                required
              />
            </Form.Group>
            <Form.Group className="d-flex justify-content-center btnn">
              <Button
                variant="primary"
                type="submit"
                className="bttn px-5 mt-3"
                disabled={loading}
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
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
      <ToastContainer />
    </div>
  );
};

export default FeedBackStu;
