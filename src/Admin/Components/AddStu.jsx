// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import "../../App.css";
import {
  FaUser,
  FaLock,
  FaVenusMars,
  FaBook,
  FaCalendar,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const AddStu = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
    contact: "",
    address: "",
    course: "",
    session: "",
  });

  const {
    first_name,
    last_name,
    email,
    gender,
    password,
    confirmPassword,
    contact,
    address,
    course,
    session,
  } = formData;
// =======
// import React, { useState, useEffect } from 'react';
// import AdminSideNav from './AdminSideNav';
// import Titile from '../../Home/Components/Titile';
// import { Button, Card, Form } from 'react-bootstrap';
// import axios from 'axios';
// import '../../App.css';

// const AddStu = () => {
//   const [formData, setFormData] = useState({
//     studentName: '',
//     email: '',
//     gender: '',
//     password: '',
//     address: '',
//     course: '',
//     profilePic: null,
//     session : ''
//   });

//   const { studentName, email, gender, password, address, profilePic, course,session } = formData;
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
// <<<<<<< HEAD
// =======
  // const [message, setMessage] = useState('');
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// <<<<<<< HEAD
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addsession/"
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
// =======
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData({ ...formData, profilePic: file });
  //   }
  // };

  // useEffect(() => {
  //   const fetchSessions = async () => {
  //       try {
  //           const response = await axios.get('http://localhost:8000/api/addsession/');
  //           setSessions(response.data); 
  //       } catch (error) {
  //           console.error("Error fetching sessions:", error);
  //           setMessage('Error fetching sessions');
  //       }
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
// <<<<<<< HEAD
        const response = await axios.get(
          "http://localhost:8000/api/addcourse/"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
// =======
      //   const response = await axios.get('http://localhost:8000/api/addcourse/')
      //   setCourses(response.data);
      // } catch (error) {
      //   console.error("Error fetching courses:", error);
      //   setMessage('Error fetching courses');
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
      }
    };
    fetchCourses();
  }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();

   setLoading(true);

   // Password validation: minimum 8 chars + at least one letter + one digit
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

   if (!passwordRegex.test(password)) {
     alert(
       "Password must be at least 8 characters long and contain both letters and numbers"
     );
     setLoading(false);
     return;
   }

   if (confirmPassword !== password) {
     alert("Passwords do not match!");
     setLoading(false);
     return;
   }

   try {
     const formDataToSend = new FormData();
     const studentName = first_name + " " + last_name;

     formDataToSend.append("student_name", studentName);
     formDataToSend.append("email", email);
     formDataToSend.append("gender", gender);
     formDataToSend.append("password", password);
     formDataToSend.append("contact", contact);
     formDataToSend.append("address", address);
     formDataToSend.append("course", course);
     formDataToSend.append("session", session);

     await axios.post("http://localhost:8000/api/addstudent/", formDataToSend, {
       headers: { "Content-Type": "multipart/form-data" },
     });

     alert("Student registered successfully!");

     setFormData({
       first_name: "",
       last_name: "",
       email: "",
       gender: "",
       password: "",
       confirmPassword: "",
       contact: "",
       address: "",
       course: "",
       session: "",
     });

     setError(null);
   } catch (error) {
     console.error("Registration error:", error.response.data);
     setError("There was an error registering the student!");
     alert("Registration failed");
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
          <div className="dash-container">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "85%" }}
            >
{/* // =======
//     try {
//         setLoading(true);
//         const formDataToSend = new FormData();
//         formDataToSend.append('student_name', studentName);
//         formDataToSend.append('email', email);
//         formDataToSend.append('gender', gender);
//         formDataToSend.append('password', password);
//         formDataToSend.append('address', address);
//         formDataToSend.append('profile_pic', profilePic);
//         formDataToSend.append('course', course);
//         formDataToSend.append('session', session); // Add this line

//         const response = await axios.post('http://localhost:8000/api/addstudent/', formDataToSend, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         alert('Student registered successfully!');
//         setFormData({
//             studentName: '',
//             email: '',
//             gender: '',
//             password: '',
//             address: '',
//             profilePic: null,
//             course: '',
//             session: '', // Reset session
//         });
//         setError(null);
//     } catch (error) {
//         console.error("Registration error:", error.response.data);
//         setError('There was an error registering the student!');
//         alert("Registration failed");
//     } finally {
//         setLoading(false);
//     }
// };


  // return (
  //   <div>
  //     <Titile />
  //     <div className='d-lg-flex d-md-block d-sm-block'>
  //       <AdminSideNav />
  //       <div className="dash flex-grow-1 p-3">
  //         <div className='dash-container'>
  //           <Card className='animate__animated animate__fadeIn mt-2' style={{ width: '85%' }}> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
              <Card.Header>
                <Card.Title>Add Student</Card.Title>
              </Card.Header>
              <Card.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
{/* <<<<<<< HEAD */}
                    <Form.Label>
                      <FaUser /> First Name :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={first_name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaUser /> Last Name :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={last_name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <HiMail /> Email :
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaVenusMars /> Gender :
                    </Form.Label>
                    <Form.Select
                      name="gender"
                      value={gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Gender --</option>
{/* ======= */}
                    {/* <Form.Label>Full Name :</Form.Label>
                    <Form.Control type='text' name="studentName" value={studentName} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email :</Form.Label>
                    <Form.Control type='email' name="email" value={email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Gender :</Form.Label>
                    <Form.Select name="gender" value={gender} onChange={handleChange} required>
                      <option value="">-- Select your Gender --</option> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Form.Select>
                  </Form.Group>
{/* <<<<<<< HEAD */}
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaLock /> Password :
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaLock />
                      Confirm Password :
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaPhone /> Contact Number :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={contact}
                      maxLength={10}
                      minLength={10}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaBook /> Course :
                    </Form.Label>
                    <Form.Select
                      name="course"
                      value={course}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaCalendar /> Session :
                    </Form.Label>
                    <Form.Select
                      name="session"
                      value={session}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Session --</option>
                      {sessions.map((dates) => (
                        <option key={dates.id} value={dates.id}>
                          {dates.year}
                        </option>
// =======
                  // <Form.Group>
                  //   <Form.Label>Password :</Form.Label>
                  //   <Form.Control type='password' name="password" value={password} onChange={handleChange} required />
                  // </Form.Group>
                  // <Form.Group>
                  //   <Form.Label>Profile Pic :</Form.Label>
                  //   <Form.Control type='file' name="profilePic" onChange={handleFileChange} />
                  // </Form.Group>
                  // <Form.Group>
                  //   <Form.Label>Address :</Form.Label>
                  //   <Form.Control as="textarea" rows={5} name="address" value={address} onChange={handleChange} />
                  // </Form.Group>
                  // <Form.Group>
                  //   <Form.Label>Course :</Form.Label>
                  //   <Form.Select name="course" value={course} onChange={handleChange} required>
                  //     <option value="">-- Select Course --</option>
                  //     {courses.map((course) => (
                  //       <option key={course.id} value={course.id}>{course.name}</option>
                  //     ))}
                  //   </Form.Select>
                  // </Form.Group>
                  // <Form.Group>
                  //   <Form.Label>Session :</Form.Label>
                  //   <Form.Select name="session" value={session} onChange={handleChange} required>
                  //     <option value="">-- Select Session --</option>
                  //     {sessions.map((dates) => (
                  //       <option key={dates.id} value={dates.id}>{dates.start_year}-----{dates.end_year}</option>
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <br />
{/* <<<<<<< HEAD */}

                  <Form.Group>
                    <Form.Label>
                      <FaMapMarkerAlt /> Address :
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="address"
                      value={address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group className="form-group justify-content-center d-flex">
                    <Button
                      className="px-5 py-2"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register The Student"}
                    </Button>
                  </Form.Group>
                  <br />
{/* ======= */}
                  {/* <Form.Group className='form-group justify-content-center d-flex'>
                    <Button className='px-5 py-2' type='submit' disabled={loading}>
                      {loading ? 'Registering...' : 'Join The Student'}
                    </Button>
                  </Form.Group> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// <<<<<<< HEAD
// export default AddStu;
// =======
export default AddStu;
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
