// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Titile from "../../Home/Components/Titile";
import StaffSideNav from "./StaffSideBar";
import { Form, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaPaperPlane } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const StaffLeave = () => {
  const [fromdate, setFromDate] = useState("");
  const [todate , settodate] = useState("");
  const [message, setMessage] = useState("");
  const [leaveReports, setLeaveReports] = useState([]); // State to hold leave reports
  const [loading, setLoading] = useState(false); // Loading state
  const email = localStorage.getItem("email");

  // Fetch leave reports when the component mounts
  useEffect(() => {
    const fetchLeaveReports = async () => {
      setLoading(true); // Start loading
      try {
        const cleanEmail = email.replace(/^"|"$/g, ""); // Clean up email string
        const response = await axios.get(
          `http://localhost:8000/api/staffleave/${cleanEmail}/`
        );

        if (response.status === 200) {
          setLeaveReports(response.data); // Set the leave reports in state
        }
      } catch (error) {
        console.error("Error fetching leave reports:", error);
        toast.error("Error fetching leave reports");
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchLeaveReports();
    // const cleanEmail = email.replace(/^"|"$/g, ""); // Clean up email string

    // const ws = new WebSocket(
    //   `ws://localhost:8000/ws/staff_leave_update/${cleanEmail}/`
    // );

    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   toast.info(`Your Leave Request has been updated`);
    //   fetchLeaveReports();
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
      const cleanEmail = email.replace(/^"|"$/g, ""); // Remove quotes if any

      const leaveApplication = {
        staff_email: cleanEmail, // Ensure the email is in a proper format
        fromdate,
        todate,
        message,
      };

      // API call to send leave request
      const response = await axios.post(
        "http://localhost:8000/api/staffleave/",
        leaveApplication
      );

      if (response.status === 200) {
        toast.success("Leave application submitted successfully");
        setFromDate("");
        settodate("");
        setMessage("");
        // Fetch updated leave reports
        const updatedReports = await axios.get(
          `http://localhost:8000/api/staffleave/${cleanEmail}/`
        );
        setLeaveReports(updatedReports.data); // Update leave reports
      } else {
        toast.error("Failed to submit leave application");
      }
    } catch (error) {
      console.error("Error submitting leave application:", error);
      toast.error("An error occurred while submitting the leave application");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideNav />
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
                        <span>
                          <FaPaperPlane /> Send
                        </span>
                      )}
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            <Card className="mt-3 " style={{ width: "90%" }}>
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
                        className="px-3 py-2 mt-3 shadow-sm"
                        key={index}
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
                              From {report.staff_name}
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {new Date(report.fromdate).toLocaleString()} -{" "}
                              {new Date(report.todate).toLocaleString()}
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

export default StaffLeave;
