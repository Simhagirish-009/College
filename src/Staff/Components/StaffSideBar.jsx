// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Offcanvas, Image } from "react-bootstrap";
import {
  FaHome,
  FaCheck,
  FaBell,
  FaPowerOff,
  FaCalendarAlt,
  FaBook,
} from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { ImProfile, ImStatsBars } from "react-icons/im";
import { CgMenuGridR } from "react-icons/cg";
import axios from "axios";
import "animate.css";
// =======
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { Navbar, Nav, Offcanvas , Image } from 'react-bootstrap';
// import { FaHome, FaCheck, FaBell, FaPowerOff, FaCalendarAlt } from 'react-icons/fa';
// import { ImProfile, ImStatsBars } from 'react-icons/im';
// import { CgMenuGridR } from 'react-icons/cg';
// import axios from 'axios';
// import 'animate.css';

// // Define role constants
// const STAFF_ROLE = 2;
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

const StaffSideNav = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [staffDetails, setStaffDetails] = useState({
// <<<<<<< HEAD
    username: "",
    email: "",
    gender: "",
    profilePic: null,
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const email = JSON.parse(localStorage.getItem("email"));
// =======
  //   username: '',
  //   email: '',
  //   gender: '',
  //   profilePic: null,
  //   address: '',
  // });
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  // const email = JSON.parse(localStorage.getItem('email'));

// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
// <<<<<<< HEAD
        const response = await axios.get(
          `http://localhost:8000/api/staff_details/?email=${email}`,
          {}
        );
        const data = response.data;
        setStaffDetails({
          username: data.details.staff_name,
          email: data.details.email,
          gender: data.details.gender,
          profilePic: data.details.profile_pic,
        });
      } catch (error) {
        console.error("Error fetching staff details:", error);
// =======
      //   const response = await axios.get(`http://localhost:8000/api/staff_details/?email=${email}`,{
          
      //   });
      //   const data = response.data;
      //   setStaffDetails({
      //     username : data.details.staff_name,
      //     email: data.details.email,
      //     gender: data.details.gender,
      //     profilePic: data.details.profile_pic,
      //     address: data.details.address,
      //   });
      // } catch (error) {
      //   console.error('Error fetching staff details:', error);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
      }
    };

    if (email) {
      fetchStaffDetails();
    }
  }, [email]);

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
        expand="lg-sm-md"
        className="d-lg-none mt-2"
      >
        <h3 style={{ color: "white" }}>Staff Dash Board</h3>
        <div style={{ display: "flex", gap: "10px", marginRight: "15px" }}>
          <span style={{ color: "white", fontSize: "22px" }}>Menu</span>
          <Navbar.Toggle
            style={{ borderColor: "white", fontSize: "15px", margin: "0px" }}
            aria-controls="offcanvasNavbar"
            onClick={handleShow}
          />
        </div>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header
          closeButton
          closeVariant="white"
          style={{
            background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
            color: "white",
          }}
        >
          <Offcanvas.Title>Staff Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <div className="d-flex   sidenav-header py-3" style={{ gap: "100px" }}>
          <Image
            roundedCircle
            height={45}
            width={45}
            style={{ marginLeft: "20px" }}
            src={`http://localhost:8000${staffDetails.profilePic}`}
          />
          <h4 className="mt-2">{staffDetails.username}</h4>
        </div>
        <Offcanvas.Body>
          <Nav className="side-nav flex-column">
            <Nav.Link
              as={Link}
              to="/staffdash/"
              style={getLinkStyle("/staffdash/")}
            >
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stafupdate/"
              style={getLinkStyle("/stafupdate/")}
            >
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mngunit/"
              style={getLinkStyle("/mngunit/")}
            >
              <FaBook /> Manage Unit
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/addresult/"
              style={getLinkStyle("/addresult/")}
            >
              <ImStatsBars /> Add Result
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/allresults/"
              style={getLinkStyle("/allresults/")}
            >
              <CgMenuGridR /> View Result
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/takeatt/"
              style={getLinkStyle("/takeatt/")}
            >
              <FaCalendarAlt /> Take Attendance
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/viewatt/"
              style={getLinkStyle("/viewatt/")}
            >
              <CgMenuGridR /> Edit Attendance
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/notifystudent/"
              style={getLinkStyle("/notifystudent/")}
            >
              <HiSpeakerphone /> Notify Student
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stafleave/"
              style={getLinkStyle("/stafleave/")}
            >
              <FaCheck /> Apply For Leave
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/staffnote/"
              style={getLinkStyle("/staffnote/")}
            >
              <FaBell /> View Notification
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/staffeedback/"
              style={getLinkStyle("/staffeedback/")}
            >
              <FaBell /> FeedBack System
            </Nav.Link>
            <Nav.Link onClick={logOut}>
              {/* ======= */}
              {/* <Navbar variant='dark' style={{ backgroundColor: '#1e3a8a', paddingLeft: '13px' }} expand="lg" className="d-lg-none mt-2">
        <h3 style={{ color: 'white' }}>Staff Dash Board</h3>
        <Navbar.Toggle style={{ borderColor: 'white', fontSize: '15px', margin: '0px' }} aria-controls="offcanvasNavbar" onClick={handleShow} />
      </Navbar> */}
              {/* Offcanvas for mobile view */}
              {/* <Offcanvas show={show} onHide={handleClose} className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Staff Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="side-nav flex-column">
            <Nav.Link as={Link} to="/staffdash/" style={getLinkStyle('/staffdash/')}>
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/stafupdate/" style={getLinkStyle('/stafupdate/')}>
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/addresult/" style={getLinkStyle('/addresult/')}>
              <ImStatsBars /> Add Result
            </Nav.Link>
            <Nav.Link as={Link} to="/editresult/" style={getLinkStyle('/editresult/')}>
              <CgMenuGridR /> Edit Result
            </Nav.Link>
            <Nav.Link as={Link} to="/takeatt/" style={getLinkStyle('/takeattendance/')}>
              <FaCalendarAlt /> Take Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/viewresult/" style={getLinkStyle('/viewresult/')}>
              <CgMenuGridR /> View/Update Result
            </Nav.Link>
            <Nav.Link as={Link} to="/stafleave/" style={getLinkStyle('/stafleave/')}>
              <FaCheck /> Apply For Leave
            </Nav.Link>
            <Nav.Link as={Link} to="/staffnote/" style={getLinkStyle('/viewstaffnote/')}>
              <FaBell /> View Notification
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
          <h3 className="py-3 text-center sidenav-header">Staff Panel</h3>
          <div className="d-flex justify-content-around  sidenav-header py-3">
            <Image
              roundedCircle
              height={45}
              width={45}
              src={`http://localhost:8000${staffDetails.profilePic}`}
            />
            <h4 className="mt-2">{staffDetails.username}</h4>
          </div>
          <Nav className="side-nav flex-column">
            <Nav.Link
              as={Link}
              to="/staffdash/"
              style={getLinkStyle("/staffdash/")}
            >
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stafupdate/"
              style={getLinkStyle("/stafupdate/")}
            >
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mngunit/"
              style={getLinkStyle("/mngunit/")}
            >
              <FaBook /> Manage Unit
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/addresult/"
              style={getLinkStyle("/addresult/")}
            >
              <ImStatsBars /> Add Result
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/allresults/"
              style={getLinkStyle("/allresults/")}
            >
              <CgMenuGridR /> View Result
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/takeatt/"
              style={getLinkStyle("/takeatt/")}
            >
              <FaCalendarAlt /> Take Attendance
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/viewatt/"
              style={getLinkStyle("/viewatt/")}
            >
              <CgMenuGridR /> Edit Attendance
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/notifystudent/"
              style={getLinkStyle("/notifystudent/")}
            >
              <HiSpeakerphone /> Notify Student
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/stafleave/"
              style={getLinkStyle("/stafleave/")}
            >
              <FaCheck /> Apply For Leave
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/staffnote/"
              style={getLinkStyle("/staffnote/")}
            >
              <FaBell /> View Notification
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/staffeedback/"
              style={getLinkStyle("/staffeedback/")}
            >
              {/* ======= */}
              {/* <div className="sidenav-container d-none d-lg-flex animate__animated animate__slideInLeft" style={{ overflowY: 'scroll' }}>
        <div className="sidenav-content">
          <h3 className="py-3 text-center sidenav-header">Staff Panel</h3>
          <div className='d-flex justify-content-around sidenav-header py-3'>
          <Image roundedCircle height={45} width={45} src={`http://localhost:8000${staffDetails.profilePic}`}/>
          <h4>{staffDetails.username}</h4>
          </div>
          <Nav className="side-nav flex-column">
            <Nav.Link as={Link} to="/staffdash/" style={getLinkStyle('/staffdash/')}>
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/stafupdate/" style={getLinkStyle('/stafupdate/')}>
              <ImProfile /> Update Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/addresult/" style={getLinkStyle('/addresult/')}>
              <ImStatsBars /> Add Result
            </Nav.Link>
            <Nav.Link as={Link} to="/allresults/" style={getLinkStyle('/allresults/')}>
              <CgMenuGridR /> View Result
            </Nav.Link>
            <Nav.Link as={Link} to="/takeatt/" style={getLinkStyle('/takeattendance/')}>
              <FaCalendarAlt /> Take Attendance
            </Nav.Link>
            <Nav.Link as={Link} to="/viewatt/" style={getLinkStyle('/viewatt/')}>
              <CgMenuGridR /> View/Update Result
            </Nav.Link>
            <Nav.Link as={Link} to="/stafleave/" style={getLinkStyle('/stafleave/')}>
              <FaCheck /> Apply For Leave
            </Nav.Link>
            <Nav.Link as={Link} to="/staffnote/" style={getLinkStyle('/viewstaffnote/')}>
              <FaBell /> View Notification
            </Nav.Link>
            <Nav.Link as={Link} to="/staffeedback/" style={getLinkStyle('/staffeedback/')}> */}
              {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
              <FaBell /> FeedBack System
            </Nav.Link>
            <Nav.Link onClick={logOut}>
              <FaPowerOff /> Logout
            </Nav.Link>
          </Nav>
        </div>
        {/* // <<<<<<< HEAD */}
        {/* //       </div> */}
        {/* // ======= */}
      </div>
      {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
    </>
  );
};

export default StaffSideNav;
