// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Alert, Card } from "react-bootstrap";
import StudentSideNav from "./StudentSideNav"; // Make sure to import your side nav
import Titile from "../../Home/Components/Titile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const StuNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const email = JSON.parse(localStorage.getItem("email")); // Get the email from local storage
  const [designation,setDesignation] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/stunotifications/${email}`
        );
        setNotifications(response.data.notifications); // Ensure you're setting the notifications array correctly
        setDesignation(response.data.designation);
      } catch (error) {
        toast.error("Error fetching notifications:", error);
        setError("Error fetching notifications");
      }
    };

    if (email) {
      // Check if email exists before fetching
      fetchNotifications();
    }
    // const ws = new WebSocket(
    //   `ws://localhost:8000/ws/stu_notifications/${email}/`
    // );

    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setNotifications((prevNotifications) => [
    //     ...prevNotifications,
    //     { message: data.message, created_at: data.created_at ,sender : data.sender},
    //   ]);
    //   toast.success(
    //     `New notification received from ${data.sender}`
    //   );
    // };

    // ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    // };

    // return () => {
    //   ws.close();
    // };
  }, [email]);

  return (
    <div>
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StudentSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Notifications</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card
            className="animate__animated animate__fadeIn mt-2"
            style={{ width: "100%" }}
          >
            <Card.Header>
              <Card.Title>View Notifications</Card.Title>
            </Card.Header>
            <Card.Body>
              <div>
                {notifications ? (
                  notifications.map((notification, index) => (
                    <Card
                      key={index}
                      className="px-3 py-1 shadow-md mb-3"
                      style={{ width: "100%" }}
                    >
                      <Card.Text>
                        <Card.Title
                          className="text-muted"
                          style={{ fontSize: "15px" }}
                        >
                          from {notification.sender}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {new Date(notification.created_at).toLocaleString()}
                        </Card.Subtitle>
                        <p style={{ fontSize: "20px" }}>
                          {notification.message}
                        </p>
                      </Card.Text>
                    </Card>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No notifications available.</td>
                  </tr>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StuNotifications;
