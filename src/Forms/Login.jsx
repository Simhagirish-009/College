// <<<<<<< HEAD
import React, { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { adminLog } from "../api"; // Import your API function
import { HiMail } from "react-icons/hi";
import { FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    try {
      const response = await adminLog({ email, password });
      setLoading(false); // Hide spinner

      // If login is successful
      if (response.data.message) {
        localStorage.setItem("email", JSON.stringify(email));
        toast.success("Login successfull !!!");
        setTimeout(() => {
          navigate("/verify_otp"); // Redirect to OTP verification page after a short delay
        }, 2000); // Delay to allow the user to see the success message
      }
    } catch (error) {
      setLoading(false); // Hide spinner

      // Handling specific errors for email and password
      const errorData = error.response.data;
      if (errorData.email) {
        toast.error(`Error : ${errorData.email}`);
      } else if (errorData.password) {
        toast.error(`Error : ${errorData.password}`);
      } else if (errorData.non_field_errors) {
        toast.error(`An error occurred : ${errorData.non_field_errors}`);
      } else {
        toast.error("check your network or try again");
      }
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  return (
    <div className="form-background">
      <div className="form-container">
        <Card className="form-card animate__animated animate__zoomIn">
          <Card.Header>
            <Card.Title>
              <h3 style={{ textAlign: "center" }}>--------LOGIN--------</h3>
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <h2 style={{ textAlign: "center" }}>Heartly Welocome</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group className="form-group">
                <Form.Label>
                  <HiMail style={{ fontSize: "20px" }} /> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  autoFocus
                  onChange={handleInputChange(setEmail)}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="form-group">
                <Form.Label>
                  <FaLock /> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  required
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Button variant="link" href="/emailverify/">
                  Forgotten Password
                </Button>
              </Form.Group>
              <br />
              <Form.Group className="form-group d-flex justify-content-center">
                <Button className="btn" type="submit" disabled={loading}>
                  {loading ? (
                    <div>
                      please wait.... <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    <span>
                       Login
                    </span>
                  )}
                </Button>
              </Form.Group>
              <br />
            </Form>
          </Card.Body>
        </Card>
      </div>

      {/* Toastify container to show notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
// =======
// import React, { useState } from 'react';
// import { Button, Card, Form, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { adminLog } from '../api';  // Import your API function
// import { HiMail } from 'react-icons/hi';
// import { FaLock } from 'react-icons/fa';
// import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
// import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);  // Loading state
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);  // Show spinner
//         try {
//             const response = await adminLog({ email, password });
//             setLoading(false);  // Hide spinner

//             if (response.data.message) {
//                 localStorage.setItem('email', JSON.stringify(email));
//                 toast.success('Login successful! Redirecting to OTP page...');
//                 setTimeout(() => {
//                     navigate('/verify_otp'); // Redirect to OTP verification page after a short delay
//                 }, 2000); // Delay to allow the user to see the success message
//             }
//         } catch (error) {
//             setLoading(false);  // Hide spinner

//             if (error.response && error.response.data) {
//                 const errors = error.response.data;

//                 if (errors.email) {
//                     toast.error(`Email error: ${errors.email}`);
//                 }
//                 if (errors.password) {
//                     toast.error(`Password error: ${errors.password}`);
//                 }
//                 if (errors.non_field_errors) {
//                     toast.error(errors.non_field_errors[0]);  // General error like invalid credentials
//                 }
//             } else {
//                 toast.error('Login failed: An unexpected error occurred.');
//             }
//         }
//     };

//     const handleInputChange = (setter) => (e) => {
//         setter(e.target.value);
//     };

//     return (
//         <div className='form-background'>
//             <div className='form-container'>
//                 <Card className='form-card animate__animated animate__zoomIn'>
//                     <Card.Header>
//                         <Card.Title><h3>Login</h3></Card.Title>
//                     </Card.Header>
//                     <Card.Body>
//                         <Form onSubmit={handleLogin}>
//                             <Form.Group className='form-group'>
//                                 <Form.Label><HiMail style={{ fontSize: '20px' }} /> Email</Form.Label>
//                                 <Form.Control
//                                     type='email'
//                                     placeholder='Enter email'
//                                     value={email}
//                                     autoFocus
//                                     onChange={handleInputChange(setEmail)}
//                                     required
//                                 />
//                             </Form.Group>
//                             <br />
//                             <Form.Group className='form-group'>
//                                 <Form.Label><FaLock /> Password</Form.Label>
//                                 <Form.Control
//                                     type='password'
//                                     placeholder='Enter password'
//                                     value={password}
//                                     onChange={handleInputChange(setPassword)}
//                                     required
//                                 />
//                             </Form.Group>
//                             <br />
//                             <Form.Group>
//                                 <Button variant='link' href='/emailverify/'>Forgotten Password</Button>
//                             </Form.Group>
//                             <br />
//                             <Form.Group className='form-group d-flex justify-content-center'>
//                             <button className='btn' type='submit'>{loading ?<div>please wait.... <Spinner animation="border" size="sm" /></div> : 'Login'}</button>
                            
//                             </Form.Group>
//                             <br />
//                         </Form>
//                     </Card.Body>
//                 </Card>
//             </div>

//             {/* Toastify container to show notifications */}
//             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//         </div>
//     );
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
};

export default Login;
