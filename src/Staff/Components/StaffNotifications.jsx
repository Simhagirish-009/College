// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Alert, Spinner, Card } from "react-bootstrap";
import StaffSideNav from "./StaffSideBar";
import Titile from "../../Home/Components/Titile";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const email = JSON.parse(localStorage.getItem("email"));
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/staffnotifications/${email}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Error fetching notifications");
        setError("Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchNotifications();
    }

    // const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${email}/`);

    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setNotifications((prevNotifications) => [
    //     ...prevNotifications,
    //     { message: data.message, created_at: data.created_at },
    //   ]);
    //   toast.info("New notification received!");
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
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3">
          <h2>Notifications from Admin</h2>

          <div className="dash-container">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "100%" }}
            >
              <Card.Header>
                <Card.Title>View Notifications</Card.Title>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                  <Spinner animation="border" />
                ) : (
                  <div>
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <Card
                          className="px-3 py-1 shadow-md mb-3"
                          style={{ width: "100%" }}
                        >
                          <Card.Text>
                            <Card.Title
                              className="text-muted"
                              style={{ fontSize: "15px" }}
                            >
                              from Admin
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {new Date(
                                notification.created_at
                              ).toLocaleString()}
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
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
  // =======
  // import React, { useState, useEffect } from 'react';
  // import { Table, Alert, Spinner , Card } from 'react-bootstrap';
  // import StaffSideNav from './StaffSideBar';
  // import Titile from '../../Home/Components/Titile';
  // import axios from 'axios';
  // import { ToastContainer, toast } from 'react-toastify';
  // import 'react-toastify/dist/ReactToastify.css';

  // const StaffNotifications = () => {
  //     const [notifications, setNotifications] = useState([]);
  //     const [error, setError] = useState('');
  //     const [loading, setLoading] = useState(true); // Loading state
  //     const email = JSON.parse(localStorage.getItem('email')); // Get the email from local storage
  //     const access_token = localStorage.getItem('access_token');
  //     useEffect(() => {
  //         const fetchNotifications = async () => {
  //             setLoading(true); // Start loading
  //             try {
  //                 const response = await axios.get(`http://localhost:8000/api/staffnotifications/${email}`,{
  //                     headers : {
  //                         Authorization : `Bearer ${access_token}`
  //                     }
  //                 });
  //                 setNotifications(response.data.notifications);
  //             } catch (error) {
  //                 console.error('Error fetching notifications:', error);
  //                 toast.error('Error fetching notifications');
  //                 setError('Error fetching notifications');
  //             } finally {
  //                 setLoading(false);
  //             }
  //         };

  //         if (email) {
  //             fetchNotifications();
  //         }
  //     }, [email]);

  //     return (
  //         <div>
  //             <Titile />
  //             <ToastContainer />
  //             <div className="d-lg-flex d-md-block d-sm-block">
  //                 <StaffSideNav />
  //                 <div className="dash flex-grow-1 p-3">
  //                     <div className="dash-container">
  //                         <Card className="animate__animated animate__fadeIn mt-2" style={{ width: '100%' }}>
  //                             <Card.Header>
  //                                 <Card.Title>Leave Application</Card.Title>
  //                             </Card.Header>
  //                             <Card.Body>
  //                     {error && <Alert variant='danger'>{error}</Alert>}
  //                     {loading ? (
  //                         <Spinner animation="border" />
  //                     ) : (
  //                         <Table bordered striped>
  //                             <thead>
  //                                 <tr>
  //                                     <th>Message</th>
  //                                     <th>Date</th>
  //                                 </tr>
  //                             </thead>
  //                             <tbody>
  //                                 {notifications.length > 0 ? (
  //                                     notifications.map((notification) => (
  //                                         <tr key={notification.id}>
  //                                             <td>{notification.message}</td>
  //                                             <td>{new Date(notification.created_at).toLocaleString()}</td>
  //                                         </tr>
  //                                     ))
  //                                 ) : (
  //                                     <tr>
  //                                         <td colSpan="2">No notifications available.</td>
  //                                     </tr>
  //                                 )}
  //                             </tbody>
  //                         </Table>
  //                          )}
  //                     </Card.Body>
  //                     </Card>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     );
  // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default StaffNotifications;
