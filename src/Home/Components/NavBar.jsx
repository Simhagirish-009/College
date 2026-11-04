import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import { FaInfo } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa';
import '../../App.css';
// <<<<<<< HEAD
  
const NavBar = () => {
  return (
    <Navbar variant="dark" sticky="top" expand="lg">
      <Container>
        <Navbar.Brand href="/">College Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" style={{ color: "white" }}>
              <FaHome /> Home
            </Nav.Link>
            <Nav.Link href="/about" style={{ color: "white" }}>
              <FaInfo /> About Us
            </Nav.Link>
            <Nav.Link href="/login" style={{ color: "white" }}>
              <FaUser /> Login
            </Nav.Link>
            <Nav.Link href="/contact" style={{ color: "white" }}>
              <FaPhone /> Contact Us
            </Nav.Link>
{/* // =======
   const colour = {
     color : 'white'
   } */}
{/* // const NavBar = () => {
  // return (
  //   <Navbar variant='dark' sticky='top' expand="lg" >
  //     <Container >
  //       <Navbar.Brand href="/">College Management System</Navbar.Brand>
  //       <Navbar.Toggle aria-controls="basic-navbar-nav" />
  //       <Navbar.Collapse id="basic-navbar-nav">
  //         <Nav className="ms-auto" >
  //           <Nav.Link href="/"><FaHome/> Home</Nav.Link>
  //           <Nav.Link href="/about"><FaInfo/> About Us</Nav.Link>
  //           <Nav.Link href="/login"><FaUser/> Login</Nav.Link>
  //           <Nav.Link href="/contact"><FaPhone/> Contact Us</Nav.Link> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
