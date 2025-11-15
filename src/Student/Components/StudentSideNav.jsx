// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Offcanvas, Image } from "react-bootstrap";
import {
  FaHome,
  FaCheckDouble,
  FaBell,
  FaPowerOff,
  FaCalendarAlt,
  FaBook,
} from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { ImProfile } from "react-icons/im";
import axios from "axios";
import "animate.css";
// =======
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { Navbar, Nav, Offcanvas,Image} from 'react-bootstrap';
// import { FaHome, FaCheck, FaBell, FaPowerOff, FaCalendarAlt } from 'react-icons/fa';
// import { ImProfile } from 'react-icons/im';
// import axios from 'axios';
// import 'animate.css';

// // Define role constants
// const STUDENT_ROLE = 3;
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

const StudentSideNav = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [studentDetails, setStudentDetails] = useState({
// <<<<<<< HEAD
    username: "",
    email: "",
    gender: "",
    profilePic: "",
    address: "",
  });
  const email = JSON.parse(localStorage.getItem("email"));

// =======
  //   username :'',
  //   email: '',
  //   gender: '',
  //   profilePic: '',
  //   address: '',
  // });

  // const email = JSON.parse(localStorage.getItem('email'));
  
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
// <<<<<<< HEAD
        const response = await axios.get(
          `http://localhost:8000/api/student_details/?email=${email}`
        );
        const data = response.data;
        setStudentDetails({
          username: data.details.student_name,
// =======
        // const response = await axios.get(`http://localhost:8000/api/student_details/?email=${email}`);
        // const data = response.data;
        // setStudentDetails({
        //   username : data.details.student_name,
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
          email: data.details.email,
          gender: data.details.gender,
          profilePic: data.details.profile_pic,
          address: data.details.address,
        });
      } catch (error) {
// <<<<<<< HEAD
        console.error("Error fetching student details:", error);
// =======
        // console.error('Error fetching student details:', error);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
      }
    };

    if (email) {
      fetchStudentDetails();
    }
  }, [email]);

  const logOut = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.clear();
// <<<<<<< HEAD
      navigate("/login/");
// =======
      // navigate('/login/');
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
    }
  };

  const isActiveLink = (path) => location.pathname === path;

  const getLinkStyle = (path) => ({
// <<<<<<< HEAD
    color: isActiveLink(path) ? "white" : "#1E3A8A",
    background: isActiveLink(path)
      ? "linear-gradient(to right, #1E3A8A, #3B82F6)"
      : "transparent",
  });
// =======
//     color: isActiveLink(path) ? 'white' : '#1E3A8A',
//     background: isActiveLink(path) 
//         ? 'linear-gradient(to right, #1E3A8A, #3B82F6)' 
//         : 'transparent',
// });
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

  return (
    <>
      {/* Mobile Navbar */}
{/* <<<<<<< HEAD */}
      <Navbar
        variant="dark"
        style={{ backgroundColor: "#1e3a8a", paddingLeft: "13px" }}
        expand="lg"
        className="d-lg-none mt-2"
      >
        <h3 style={{ color: "white" }}>Student Dash Board</h3>
        <div style={{ display: "flex", gap: "10px", marginRight: "15px" }}>
          <span style={{ color: "white", fontSize: "22px" }}>Menu</span>
          <Navbar.Toggle
            style={{ borderColor: "white", fontSize: "15px", margin: "0px" }}
            aria-controls="offcanvasNavbar"
            onClick={handleShow}
          />
        </div>
{/* ======= */}
      {/* <Navbar variant='dark' style={{ backgroundColor: '#1e3a8a', paddingLeft: '13px' }} expand="lg" className="d-lg-none mt-2">
        <h3 style={{ color: 'white' }}>Student Dash Board</h3>
        <Navbar.Toggle style={{ borderColor: 'white', fontSize: '15px', margin: '0px' }} aria-controls="offcanvasNavbar" onClick={handleShow} /> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
      </Navbar>

      {/* Offcanvas for mobile view */}
      <Offcanvas show={show} onHide={handleClose} className="d-lg-none">
{/* <<<<<<< HEAD */}
        <Offcanvas.Header
          closeButton
          closeVariant="white"
          style={{
            background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
            color: "white",
          }}
        >
          <Offcanvas.Title>Student Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <div className="d-flex   sidenav-header py-3" style={{ gap: "100px" }}>
          <Image
            roundedCircle
            alt="prifile_pic"
            height={45}
            width={45}
            style={{ marginLeft: "20px" }}
            src={`http://localhost:8000${studentDetails.profilePic}`}
          />
          <h4 className="mt-2">{studentDetails.username}</h4>
        </div>
        <Offcanvas.Body>
          <Nav className="side-nav flex-column">
            <Nav.Link
              as={Link}
              to="/studash/"
              style={getLinkStyle("/studash/")}
            >
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stuupdate/"
              style={getLinkStyle("/stuupdate/")}
            >
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/viewAtt/"
              style={getLinkStyle("/viewAtt/")}
            >
              <FaCalendarAlt /> View Attendance
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stunotify/"
              style={getLinkStyle("/stunotify/")}
            >
              <FaBell /> View Notifications
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stuleave/"
              style={getLinkStyle("/stuleave/")}
            >
              <FaCheckDouble /> Apply For Leave
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stufeedback/"
              style={getLinkStyle("/stufeedback/")}
            >
              <HiSpeakerphone /> FeedBack
            </Nav.Link>
            <Nav.Link onClick={logOut}>
{/* ======= */}
        {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title>Student Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="side-nav flex-column">
            <Nav.Link as={Link} to="/studash/" style={getLinkStyle('/studash/')}>
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/stuupdate/" style={getLinkStyle('/stuupdate/')}>
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/viewAtt/" style={getLinkStyle('/viewAtt/')}>
              <FaCalendarAlt /> View Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/stunotify/" style={getLinkStyle('/stunotify/')}>
              <FaBell /> View Notifications
            </Nav.Link>
            <Nav.Link as={Link} to="/stuleave/" style={getLinkStyle('/stuleave/')}>
              <FaCheck /> Apply For Leave
            </Nav.Link>
            <Nav.Link onClick={logOut} style={{ fontWeight: 'normal', color: 'white' }}> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
              <FaPowerOff /> Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
{/* <<<<<<< HEAD */}
      <div
        className="sidenav-container d-none d-lg-flex animate__animated animate__slideInLeft"
        style={{ overflowY: "scroll" }}
      >
        <div className="sidenav-content">
          <h4 className="py-3 text-center sidenav-header">Student Panel</h4>

          <div
            className="d-flex  sidenav-header px-2 py-2"
            style={{ gap: "20px" }}
          >
            <Image
              roundedCircle
              height={50}
              width={50}
              src={`http://localhost:8000${studentDetails.profilePic}`}
            />
            <h4 className="mt-2">{studentDetails.username}</h4>
          </div>

          <Nav className="side-nav flex-column mt-2">
            <Nav.Link
              as={Link}
              to="/studash/"
              style={getLinkStyle("/studash/")}
            >
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stuupdate/"
              style={getLinkStyle("/stuupdate/")}
            >
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/viewattstu/"
              style={getLinkStyle("/viewattstu/")}
            >
              <FaCalendarAlt /> View Attendance
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/viewres/"
              style={getLinkStyle("/viewres/")}
            >
              <FaBook /> View Results
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stunotify/"
              style={getLinkStyle("/stunotify/")}
            >
              <FaBell /> View Notifications
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stuleave/"
              style={getLinkStyle("/stuleave/")}
            >
              <FaCheckDouble /> Apply For Leave
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stufeedback/"
              style={getLinkStyle("/stufeedback/")}
            >
              <HiSpeakerphone /> FeedBack
{/* ======= */}
      {/* <div className="sidenav-container d-none d-lg-flex animate__animated animate__slideInLeft" style={{ overflowY: 'scroll' }}>
        <div className="sidenav-content">
          <h4 className="py-3 text-center sidenav-header">Student Panel</h4>

          <div className='d-flex  sidenav-header px-2 py-2' style={{gap  : '20px'}}>
            <Image roundedCircle height={50} width={50} src={`http://localhost:8000${studentDetails.profilePic}`}/>
            <h4 className='mt-2'>{studentDetails.username}</h4>
          </div>

          <Nav className="side-nav flex-column mt-2">
            <Nav.Link as={Link} to="/studash/" style={getLinkStyle('/studash/')}>
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/stuupdate/" style={getLinkStyle('/stuupdate/')}>
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/viewattstu/" style={getLinkStyle('/viewattstu/')}>
              <FaCalendarAlt /> View Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/stunotify/" style={getLinkStyle('/stunotify/')}>
              <FaBell /> View Notifications
            </Nav.Link>
            <Nav.Link as={Link} to="/stuleave/" style={getLinkStyle('/stuleave/')}>
              <FaCheck /> Apply For Leave
            </Nav.Link>
            <Nav.Link as={Link} to="/stufeedback/" style={getLinkStyle('/stufeedback/')}>
              <FaCheck /> FeedBack */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
            </Nav.Link>
            <Nav.Link onClick={logOut}>
              <FaPowerOff /> Logout
            </Nav.Link>
          </Nav>
        </div>
      </div>
    </>
  );
};

export default StudentSideNav;
