// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSideNav from "./StudentSideNav";
import Titile from "../../Home/Components/Titile";
import {
  Button,
  Card,
  Modal,
  Form,
  ListGroup,
  Image,
  Spinner,
} from "react-bootstrap";
import "../../App.css";
import {
  FaUser,
  FaVenusMars,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const StuUpdate = () => {
  const [studentDetails, setStudentDetails] = useState({
    id: "",
    student_name: "",
    email: "",
    gender: "",
    profilePic: "",
    address: "",
// =======
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import StudentSideNav from './StudentSideNav';
// import Titile from '../../Home/Components/Titile';
// import { Button, Card, Modal, Form, ListGroup, Image, Spinner } from 'react-bootstrap';
// import '../../App.css';

// const StuUpdate = () => {
//   const [studentDetails, setStudentDetails] = useState({
//     id: '',
//     student_name: '',
//     email: '',
//     gender: '',
//     profilePic: '',
//     address: '',
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  });

  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState(studentDetails);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null); // State for the profile picture file

// <<<<<<< HEAD
  const email = JSON.parse(localStorage.getItem("email"));
// =======
  // const email = JSON.parse(localStorage.getItem('email'));
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

  // Fetch student details based on email
  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
// <<<<<<< HEAD
        const response = await axios.get(
          `http://localhost:8000/api/student_details/?email=${email}`
        );
// =======
        // const response = await axios.get(`http://localhost:8000/api/student_details/?email=${email}`);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
        const data = response.data;
        setStudentDetails({
          id: data.details.id,
          student_name: data.details.student_name,
          email: data.details.email,
          gender: data.details.gender,
          profilePic: data.details.profile_pic,
          address: data.details.address,
        });
        setFormValues({
          id: data.details.id,
          student_name: data.details.student_name,
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
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchStudentDetails();
    }
  }, [email]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle profile picture change
  const handleFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
// <<<<<<< HEAD

    const formData = new FormData();
    formData.append("student_name", formValues.student_name);
    formData.append("email", formValues.email);
    formData.append("gender", formValues.gender);
    formData.append("address", formValues.address);
    if (profilePicFile) {
      formData.append("profile_pic", profilePicFile); // Append the file if it exists
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/student/${formValues.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setStudentDetails({
        ...formValues,
        profilePic: response.data.profile_pic,
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
// =======
    
    // const formData = new FormData();
    // formData.append('student_name', formValues.student_name);
    // formData.append('email', formValues.email);
    // formData.append('gender', formValues.gender);
    // formData.append('address', formValues.address);
    // if (profilePicFile) {
    //   formData.append('profile_pic', profilePicFile); // Append the file if it exists
    // }

    // try {
    //   const response = await axios.put(`http://localhost:8000/api/student/${formValues.id}/`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   setStudentDetails({ ...formValues, profilePic: response.data.profile_pic });

    //   setShowModal(false);
    // } catch (error) {
    //   console.error('Error updating profile:', error);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <Titile />
{/* <<<<<<< HEAD */}
      <div className="d-lg-flex d-md-block d-sm-block">
        <StudentSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "60%" }}
            >
              <Card.Header>
                <Card.Title className="d-flex justify-content-center">
                  <h3>Student Details</h3>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup>
                  <ListGroup.Item className="d-flex flex-column align-items-center">
                    <Image
                      className="animate__animated animate__zoomIn"
                      roundedCircle
                      alt="prifile_pic"
                      height={200}
                      width={200}
                      src={`http://localhost:8000${studentDetails.profilePic}`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item style={{ textAlign: "center" }}>
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {studentDetails.student_name || "Not specified"}
                      </h3>
                    </div>
                    <hr />
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {studentDetails.email}
                      </h3>
                    </div>
                    <hr />
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {studentDetails.gender || "Not specified"}
                      </h3>
                    </div>
                  </ListGroup.Item>
                </ListGroup>

                <br />
                <br />
                <div className="btnn d-flex justify-content-center">
                  <Button
                    className="bttn px-5"
                    onClick={() => setShowModal(true)}
                  >
                    Update Profile
                  </Button>
{/* ======= */}
      {/* <div className='d-lg-flex d-md-block d-sm-block'>
        <StudentSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className='dash-container'>
            <Card className='animate__animated animate__fadeIn mt-2' style={{ width: '60%' }}>
              <Card.Header>
                <Card.Title className='d-flex justify-content-center'><h3>Student Details</h3></Card.Title>
              </Card.Header>
              <Card.Body>
                <ListGroup>
                  <ListGroup.Item className='d-flex justify-content-center'>
                    <Image roundedCircle height={200} width={200} src={`http://localhost:8000${studentDetails.profilePic}`} />
                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-center'>
                    <h2>{studentDetails.student_name}</h2>
                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-center'>
                    <h2>{studentDetails.email}</h2>
                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-center'>
                    <h2>{studentDetails.gender}</h2>
                  </ListGroup.Item>
                </ListGroup>

                <br /><br />
                <div className='btnn d-flex justify-content-center'>
                  <Button className='bttn px-5' onClick={() => setShowModal(true)}>Update Profile</Button> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                </div>
              </Card.Body>
            </Card>

            {/* Modal for updating profile */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
{/* <<<<<<< HEAD */}
              <Modal.Header closeButton closeVariant="white">
{/* ======= */}
              {/* <Modal.Header closeButton> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                <Modal.Title>Update Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
{/* <<<<<<< HEAD */}
                    <Form.Label>
                      <FaUser /> User Name :
                    </Form.Label>
{/* ======= */}
                    {/* <Form.Label>First Name</Form.Label> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                    <Form.Control
                      type="text"
                      name="student_name"
                      value={formValues.student_name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
{/* <<<<<<< HEAD */}
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <HiMail /> Email :
                    </Form.Label>
{/* ======= */}
                  {/* <Form.Group>
                    <Form.Label>Email</Form.Label> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                    <Form.Control
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
{/* <<<<<<< HEAD */}
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaVenusMars /> Gender :{" "}
                    </Form.Label>
                    <Form.Select
                      name="gender"
                      value={formValues.gender}
                      onChange={handleInputChange}
                    >
{/* ======= */}

                  {/* <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formValues.gender} onChange={handleInputChange}> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                      <option value="">-- Select Gender --</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Form.Select>
                  </Form.Group>
{/* <<<<<<< HEAD */}
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaImage /> Profile Picture
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaMapMarkerAlt /> Address :
                    </Form.Label>
{/* ======= */}

                  {/* <Form.Group>
                    <Form.Label>Address</Form.Label> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
{/* <<<<<<< HEAD */}
                  <br />
                  <div className="btnn d-flex justify-content-center ">
                    <Button
                      className="bttn px-5"
                      type="submit"
                      disabled={updating}
                    >
                      {loading ? (
                        <div>
                          please wait....{" "}
                          <Spinner animation="border" size="sm" />
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
{/* ======= */}      
                  {/* <Form.Group>
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <br />
                  
                  <Button variant="primary" type="submit" disabled={updating}>
                    {updating ? <Spinner as="span" animation="border" size="sm" /> : 'Save Changes'}
                  </Button>
                </Form>
              </Modal.Body>
            </Modal> */}

{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StuUpdate;
