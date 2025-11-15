// <<<<<<< HEAD
import React, { useState , useEffect} from "react";
import { Navbar, Nav, Offcanvas , Image} from "react-bootstrap";
import {
  FaHome,
  FaPowerOff,
  FaBookmark,
  FaBook,
  FaCalendar,
  FaCheckDouble,
} from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { HiUserAdd, HiSpeakerphone } from "react-icons/hi";
import { CgMenuGridR, CgNotifications } from "react-icons/cg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "animate.css";
// =======
// import React, { useState, useEffect } from 'react';
// import { Navbar, Nav, Offcanvas , Image } from 'react-bootstrap';
// import { FaHome, FaPowerOff, FaBookmark, FaBook, FaCalendar, FaCheckDouble } from 'react-icons/fa';
// import { ImProfile } from 'react-icons/im';
// import { HiUserAdd, HiSpeakerphone } from 'react-icons/hi';
// import { CgMenuGridR, CgNotifications } from 'react-icons/cg';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import 'animate.css';
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

const AdminSideNav = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [adminDetails, setAdminDetails] = useState({
// <<<<<<< HEAD
    username: "",
    email: "",
    profilePic: "",
// =======
    // username: '',
    // email: '',
    // password: '',
    // gender: '',
    // address: '',
    // profilePic: ''
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

// <<<<<<< HEAD
  const email = JSON.parse(localStorage.getItem("email"));
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/admin/?email=${email}`
        );
// =======
  // const email = JSON.parse(localStorage.getItem('email'))
  // useEffect(() => {
  //   const fetchAdminDetails = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8000/api/admin/?email=${email}`);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
        const data = response.data;
        setAdminDetails({
          username: data.details.username,
          email: data.details.email,
// <<<<<<< HEAD
          profilePic: data.details.profile_pic,
        });
      } catch (error) {
        console.error("Error fetching admin details:", error);
// =======
      //     password: data.details.password,
      //     gender: data.details.gender,
      //     address: data.details.address,
      //     profilePic: data.details.profile_pic
      //   });
      // } catch (error) {
      //   console.error('Error fetching admin details:', error);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
      }
    };

    if (email) {
      fetchAdminDetails();
    }
  }, [email]);
// <<<<<<< HEAD

// =======
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  const logOut = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.clear();
// <<<<<<< HEAD
//       navigate("/login/");
// =======
      navigate('/login/');
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
    }
  };

  // Function to determine if the current path matches the link path
  const isActiveLink = (path) => location.pathname === path;

  // Function to get styles for active/inactive links
  const getLinkStyle = (path) => ({
    // <<<<<<< HEAD
    color: isActiveLink(path) ? "white" : "#1e3a8a",
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
        <h3 style={{ color: "white" }}>Admin Dash Board</h3>
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
        <h3 style={{ color: 'white' }}>Admin Dash Board</h3>
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
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <div className="d-flex   sidenav-header py-3" style={{ gap: "100px" }}>
          <Image
            roundedCircle
            height={45}
            width={45}
            alt="prifile_pic"
            style={{ marginLeft: "20px" }}
            src={`http://localhost:8000${adminDetails.profilePic}`}
          />
          <h4 className="mt-2">{adminDetails.username}</h4>
        </div>
        <Offcanvas.Body>
          <Nav className="side-nav flex-column ">
            <Nav.Link
              as={Link}
              to="/admindash/"
              style={getLinkStyle("/admindash/")}
            >
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admupdate/"
              style={getLinkStyle("/admupdate/")}
            >
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mngcourse/"
              style={getLinkStyle("/mngcourse/")}
            >
              <FaBookmark /> Manage Course
            </Nav.Link>
            <Nav.Link as={Link} to="/mngsub/" style={getLinkStyle("/mngsub/")}>
              <FaBook /> Manage Subject
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mngsession/"
              style={getLinkStyle("/mngsession/")}
            >
              <FaCalendar /> Manage Session
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/addstaff/"
              style={getLinkStyle("/addstaff/")}
            >
              <HiUserAdd /> Add Staff
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mngstaff/"
              style={getLinkStyle("/mngstaff/")}
            >
              <CgMenuGridR /> Manage Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/addstu/" style={getLinkStyle("/addstu/")}>
              <HiUserAdd /> Add Student
            </Nav.Link>
            <Nav.Link as={Link} to="/mngstu/" style={getLinkStyle("/mngstu/")}>
              <CgMenuGridR /> Manage Student
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/notifystaff/"
              style={getLinkStyle("/notifystaff/")}
            >
              <HiSpeakerphone /> Notify Staff
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/notifystu/"
              style={getLinkStyle("/notifystu/")}
            >
              <HiSpeakerphone /> Notify Student
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/feedbackstaff/"
              style={getLinkStyle("/feedbackstaff/")}
            >
              <HiSpeakerphone /> Staff Feedback
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/feedbackstu/"
              style={getLinkStyle("/feedbackstu/")}
            >
              <HiSpeakerphone /> Student Feedback
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stafapprove/"
              style={getLinkStyle("/stafapprove/")}
            >
              <FaCheckDouble /> Staff Leave
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stuapprove/"
              style={getLinkStyle("/stuapprove/")}
            >
              <FaCheckDouble /> Student Leave
            </Nav.Link>
            <Nav.Link
              onClick={logOut}
              style={{ fontWeight: "normal", color: "white" }}
            >
              {/* =======  */}
              {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="side-nav flex-column animate__animated animate__zoomIn">
            <Nav.Link as={Link} to="/admindash/" style={getLinkStyle('/admindash/')}>
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/admupdate/" style={getLinkStyle('/admupdate/')}>
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/mngcourse/" style={getLinkStyle('/mngcourse/')}>
              <FaBookmark /> Manage Course
            </Nav.Link>
            <Nav.Link as={Link} to="/mngsub/" style={getLinkStyle('/mngsub/')}>
              <FaBook /> Manage Subject
            </Nav.Link>
            <Nav.Link as={Link} to='/mngsession/' style={getLinkStyle('/mngsession/')}>
              <FaCalendar /> Manage Session
            </Nav.Link>
            <Nav.Link as={Link} to="/addstaff/" style={getLinkStyle('/addstaff/')}>
              <HiUserAdd /> Add Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/mngstaff/" style={getLinkStyle('/mngstaff/')}>
              <CgMenuGridR /> Manage Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/addstu/" style={getLinkStyle('/addstu/')}>
              <HiUserAdd /> Add Student
            </Nav.Link>
            <Nav.Link as={Link} to="/mngstu/" style={getLinkStyle('/mngstu/')}>
              <CgMenuGridR /> Manage Student
            </Nav.Link>
            <Nav.Link as={Link} to="/notifystaff/" style={getLinkStyle('/notifystaff/')}>
              <HiSpeakerphone /> Notify Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/notifystu/" style={getLinkStyle('/notifystu/')}>
              <HiSpeakerphone /> Notify Student
            </Nav.Link>
            <Nav.Link as={Link} to="/feedbackstaff/" style={getLinkStyle('/feedbackstaff/')}>
              <HiSpeakerphone /> Staff Feedback
            </Nav.Link>
            <Nav.Link as={Link} to="/feedbackstu/" style={getLinkStyle('/feedbackstu/')}>
              <HiSpeakerphone /> Student Feedback
            </Nav.Link>
            <Nav.Link as={Link} to="/stafapprove/" style={getLinkStyle('/stafapprove/')}>
              <FaCheckDouble /> Staff Leave
            </Nav.Link>
            <Nav.Link as={Link} to="/stuapprove/" style={getLinkStyle('/stuapprove/')}>
              <FaCheckDouble /> Student Leave
            </Nav.Link>
            <Nav.Link onClick={logOut} style={{ fontWeight: 'normal', color: 'white' }}>
>>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
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
          <h3 className="py-3 text-center sidenav-header">Admin Panel</h3>
          <div className="d-flex justify-content-around sidenav-header py-3">
            <Image
              roundedCircle
              height={45}
              width={45}
              src={`http://localhost:8000${adminDetails.profilePic}`}
            />
            <h4 className="mt-2">{adminDetails.username}</h4>
          </div>
          <Nav className="side-nav flex-column">
            <Nav.Link
              as={Link}
              to="/admindash/"
              style={getLinkStyle("/admindash/")}
            >
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admupdate/"
              style={getLinkStyle("/admupdate/")}
            >
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mngcourse/"
              style={getLinkStyle("/mngcourse/")}
            >
              <FaBookmark /> Manage Course
            </Nav.Link>
            <Nav.Link as={Link} to="/mngsub/" style={getLinkStyle("/mngsub/")}>
              <FaBook /> Manage Subject
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/mngsession/"
              style={getLinkStyle("/mngsession/")}
            >
              <FaCalendar /> Manage Sessions
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/addstaff/"
              style={getLinkStyle("/addstaff/")}
            >
              <HiUserAdd /> Add Staff
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mngstaff"
              style={getLinkStyle("/mngstaff")}
            >
              <CgMenuGridR /> Manage Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/addstu/" style={getLinkStyle("/addstu/")}>
              <HiUserAdd /> Add Student
            </Nav.Link>
            <Nav.Link as={Link} to="/mngstu/" style={getLinkStyle("/mngstu/")}>
              <CgMenuGridR /> Manage Student
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/viewallatt/"
              style={getLinkStyle("/viewallatt/")}
            >
              <CgMenuGridR /> View Attendance
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/viewallres/"
              style={getLinkStyle("/viewallres/")}
            >
              <CgMenuGridR /> View Results
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/feedbackstaff/"
              style={getLinkStyle("/feedbackstaff/")}
            >
              <CgNotifications /> Staff Feedback
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/feedbackstu/"
              style={getLinkStyle("/feedbackstu/")}
            >
              <CgNotifications /> Student Feedback
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/notifystaff/"
              style={getLinkStyle("/notifystaff/")}
            >
              <HiSpeakerphone />
              Notify Staff
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/notifystu/"
              style={getLinkStyle("/notifystu/")}
            >
              <HiSpeakerphone /> Notify Student
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stafapprove/"
              style={getLinkStyle("/stafapprove/")}
            >
              <FaCheckDouble /> Staff Leave
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stuapprove/"
              style={getLinkStyle("/stuapprove/")}
            >
              {/* // =======  */}
              {/* <div className="sidenav-container d-none d-lg-flex animate__animated animate__slideInLeft" style={{ overflowY: 'scroll' }}>
        <div className="sidenav-content">
          <h3 className="py-3 text-center sidenav-header">Admin Panel</h3>
          <div className='d-flex justify-content-around sidenav-header py-3'>
            <Image roundedCircle height={45} width={45} src={`http://localhost:8000${adminDetails.profilePic}`}/>
            <h4>{adminDetails.username}</h4>
          </div>
          <Nav className="side-nav flex-column">
            <Nav.Link as={Link} to="/admindash/" style={getLinkStyle('/admindash/')}>
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/admupdate/" style={getLinkStyle('/admupdate/')}>
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/mngcourse/" style={getLinkStyle('/mngcourse/')}>
              <FaBookmark /> Manage Course
            </Nav.Link>
            <Nav.Link as={Link} to="/mngsub/" style={getLinkStyle('/mngsub/')}>
              <FaBook /> Manage Subject
            </Nav.Link>
            <Nav.Link as={Link} to="/mngunit/" style={getLinkStyle('/mngunit/')}>
              <FaBook /> Manage Unit
            </Nav.Link>
            <Nav.Link as={Link} to="/mngsession/" style={getLinkStyle('/mngsession/')}>
              <FaCalendar /> Manage Sessions
            </Nav.Link>
            <Nav.Link as={Link} to="/addstaff/" style={getLinkStyle('/addstaff/')}>
              <HiUserAdd /> Add Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/mngstaff" style={getLinkStyle('/mngstaff')}>
              <CgMenuGridR /> Manage Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/addstu/" style={getLinkStyle('/addstu/')}>
              <HiUserAdd /> Add Student
            </Nav.Link>
            <Nav.Link as={Link} to="/mngstu/" style={getLinkStyle('/mngstu')}>
              <CgMenuGridR /> Manage Student
            </Nav.Link>
            <Nav.Link as={Link} to="/viewallatt/" style={getLinkStyle('/viewallatt')}>
              <CgMenuGridR /> View Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/viewallres/" style={getLinkStyle('/viewallres')}>
              <CgMenuGridR /> View Results
            </Nav.Link>
            <Nav.Link as={Link} to="/feedbackstaff/" style={getLinkStyle('/feedbackstaff/')}>
              <CgNotifications/> Staff Feedback
            </Nav.Link>
            <Nav.Link as={Link} to="/feedbackstu/" style={getLinkStyle('/feedbackstu/')}>
              <CgNotifications/> Student Feedback
            </Nav.Link>
            <Nav.Link as={Link} to="/notifystaff/" style={getLinkStyle('/notifystaff/')}>
              <HiSpeakerphone />Notify Staff
            </Nav.Link>
            <Nav.Link as={Link} to="/notifystu/" style={getLinkStyle('/notifystu/')}>
              <HiSpeakerphone /> Notify Student
            </Nav.Link>
            <Nav.Link as={Link} to="/stafapprove/" style={getLinkStyle('/stafapprove/')}>
              <FaCheckDouble /> Staff Leave
            </Nav.Link>
            <Nav.Link as={Link} to="/stuapprove/" style={getLinkStyle('/stuapprove/')}> */}
              {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
              <FaCheckDouble /> Student Leave
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

export default AdminSideNav;
