
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { Button, Card, Modal, Form, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "../../App.css";
import { FaPaperPlane, FaReply } from "react-icons/fa";

const ApproveStaff = () => {
  const [leaveReports, setLeaveReports] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchLeaveReports = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          "http://localhost:8000/api/staff_leave_request/"
        );
        if (response.status === 200) {
          setLeaveReports(response.data);
        }
      } catch (error) {
        console.error("Error fetching leave reports:", error);
        setError("An error occurred while fetching leave reports.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchLeaveReports();
    // const socket = new WebSocket("ws://127.0.0.1:8000/ws/leave_requests/");

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
    setShowModal(true);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchLeaveReports = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          "http://localhost:8000/api/staff_leave_request/"
        );
        if (response.status === 200) {
          setLeaveReports(response.data);
        }
      } catch (error) {
        console.error("Error fetching leave reports:", error);
        setError("An error occurred while fetching leave reports.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    setLoading(true); // Start loading
    try {
      await axios.put(
        `http://localhost:8000/api/staff_leave_request/${selectedReport.id}/`,
        { status }
      );
      setShowModal(false);
      setStatus("");
      setSelectedReport(null);
      fetchLeaveReports();
      toast.success("Leave request status updated!"); // Success notification
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Failed to update leave request status."); // Error notification
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="root">
      <ToastContainer />
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Leave Requests (Staff) </h2>
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
                        className="px-3 py-2 mt-3 shadow-sm"
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
                              From {report.staff_name}({report.course})
                            </Card.Title>
                          </div>
                          <div>
                            <b>({report.status})</b>
                          </div>
                        </div>
                        <Card.Text style={{ fontSize: "18px" }}>
                          <div>
                            <br />
                            {report.message}
                            <br />
                            <br />
                            From {report.fromdate} to {report.todate}
                          </div>
                        </Card.Text>
                        <div className="d-flex flex-row-reverse">
                          <br />

                          <Button
                            className="px-5"
                            variant="primary"
                            onClick={() => handleReplyClick(report)}
                            disabled={report.status !== "pending"} // Disable button if status is not pending
                            style={{
                              display:
                                report.status !== "pending" ? "none" : "block",
                            }} // Hide button after update
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
    </div>
  );
};

export default ApproveStaff;
