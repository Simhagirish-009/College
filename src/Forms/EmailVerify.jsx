// <<<<<<< HEAD
import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { sendResetCode } from "../api"; // API call to send reset code
import { useNavigate } from "react-router-dom";
import { HiMail } from "react-icons/hi";

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    localStorage.setItem("email", JSON.stringify(email));
    setLoading(true);
    try {
      await sendResetCode(email);
      setMessage("Verification code sent to your email.");
      navigate("/reset/");
    } catch (error) {
      setMessage("Failed to send code. Please check your email and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="form-background">
      <div className="form-container">
        <Card className="form-card animate__animated animate__zoomIn">
          <Card.Header>
            <Card.Title>
              <h3 style={{ textAlign: "center" }}>Forgot Password</h3>
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSendCode}>
              <Form.Group className="form-group">
                <Form.Label>
                  <HiMail style={{ fontSize: "20px" }} /> Email :{" "}
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </Form.Group>
              <br />
              <Form.Group className="btnn form-group d-flex justify-content-center">
                <Button className="bttn px-5" type="submit">
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </Form.Group>

              <br />
              {message && (
                <Alert variant="info" className="mt-3">
                  {message}
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
// =======
// import React, { useState } from 'react';
// import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { sendResetCode } from '../api';  // API call to send reset code
// import { useNavigate } from 'react-router-dom';

// const EmailVerify = () => {
//     const [email, setEmail] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate()

//     const handleSendCode = async (e) => {
//         e.preventDefault();
//         localStorage.setItem('email',JSON.stringify(email))
//         setLoading(true);
//         try {
//             await sendResetCode(email);
//             setMessage('Verification code sent to your email.');
//             navigate('/reset/')
//         } catch (error) {
//             setMessage('Failed to send code. Please check your email and try again.');
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="form-background">
//             <div className="form-container">
//                 <Card className="form-card animate__animated animate__zoomIn">
//                     <Card.Header>
//                         <Card.Title><h3>Forgot Password</h3></Card.Title>
//                     </Card.Header>
//                     <Card.Body>
//                         <Form onSubmit={handleSendCode}>
//                             <Form.Group className="form-group">
//                                 <Form.Label>Email</Form.Label>
//                                 <Form.Control
//                                     type="email"
//                                     placeholder="Enter your email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                 />
//                             </Form.Group>
//                             <br />
//                             <Button className="btn" type="submit">
//                                 {loading ? <Spinner animation="border" size="sm" /> : 'Send Verification Code'}
//                             </Button>
//                             <br />
//                             {message && <Alert variant="info" className="mt-3">{message}</Alert>}
//                         </Form>
//                     </Card.Body>
//                 </Card>
//             </div>
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default EmailVerify;
