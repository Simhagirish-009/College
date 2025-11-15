// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffSideNav from "./StaffSideBar";
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
import { ToastContainer, toast } from "react-toastify";
import {
  FaUser,
  FaVenusMars,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

const StaUpdate = () => {
  const [staffDetails, setStaffDetails] = useState({
    id: "",
    staff_name: "",
    email: "",
    gender: "",
    profilePic: "",
    address: "",
    contact: "",
// =======
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import StaffSideNav from './StaffSideBar';
// import Titile from '../../Home/Components/Titile';
// import { Button, Card, Modal, Form, ListGroup, Image, Spinner } from 'react-bootstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../../App.css';

// const StaUpdate = () => {
//   const [staffDetails, setStaffDetails] = useState({
//     id: '',
//     staff_name: '',
//     email: '',
//     gender: '',
//     profilePic: '',
//     address: '',
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  });

  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState(staffDetails);
  const [profilePicFile, setProfilePicFile] = useState(null); // Profile picture file state
  const [loading, setLoading] = useState(true); // Loading state for fetching details
  const [updating, setUpdating] = useState(false); // Loading state for updating profile

// <<<<<<< HEAD
  const email = JSON.parse(localStorage.getItem("email"));
// =======
  // const email = JSON.parse(localStorage.getItem('email'));
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

  useEffect(() => {
    const fetchStaffDetails = async () => {
      setLoading(true); // Start loading
      try {
// <<<<<<< HEAD
        const response = await axios.get(
          `http://localhost:8000/api/staff_details/?email=${email}`
        );
// =======
        // const response = await axios.get(`http://localhost:8000/api/staff_details/?email=${email}`);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
        const data = response.data;
        setStaffDetails({
          id: data.details.id,
          staff_name: data.details.staff_name,
          email: data.details.email,
          gender: data.details.gender,
          contact:data.details.contact,
          profilePic: data.details.profile_pic,
          address: data.details.address,
        });
        setFormValues({
          id: data.details.id,
          staff_name: data.details.staff_name,
          email: data.details.email,
          gender: data.details.gender,
          contact: data.details.contact,
          profilePic: data.details.profile_pic,
          address: data.details.address,
        });
      } catch (error) {
// <<<<<<< HEAD
        console.error("Error fetching staff details:", error);
        toast.error("Error fetching staff details"); // Show Toastify error notification
// =======
        // console.error('Error fetching staff details:', error);
        // toast.error('Error fetching staff details'); // Show Toastify error notification
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
      } finally {
        setLoading(false); // End loading
      }
    };

    if (email) {
      fetchStaffDetails();
    }
  }, [email]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle profile picture file change
  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true); // Start updating

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
// <<<<<<< HEAD
      formData.append("staff_name", formValues.staff_name);
      formData.append("email", formValues.email);
      formData.append("gender", formValues.gender);
      formData.append("address", formValues.address);
      formData.append("contact",formValues.contact);

      // Append profile picture if a new one is selected
      if (profilePicFile) {
        formData.append("profile_pic", profilePicFile);
// =======
      // formData.append('staff_name', formValues.staff_name);
      // formData.append('email', formValues.email);
      // formData.append('gender', formValues.gender);
      // formData.append('address', formValues.address);

      // // Append profile picture if a new one is selected
      // if (profilePicFile) {
      //   formData.append('profile_pic', profilePicFile);
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
      }

      const response = await axios.put(
        `http://localhost:8000/api/staff_update/${formValues.id}/`,
        formData,
        {
          headers: {
// <<<<<<< HEAD
//             "Content-Type": "multipart/form-data",
// =======
            'Content-Type': 'multipart/form-data',
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
          },
        }
      );

      setStaffDetails({ ...formValues, profilePic: response.data.profile_pic });
// <<<<<<< HEAD
      toast.success("Profile updated successfully!"); // Show success notification
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile"); // Show Toastify error notification
// =======
    //   toast.success('Profile updated successfully!'); // Show success notification
    //   setShowModal(false);
    // } catch (error) {
    //   console.error('Error updating profile:', error);
    //   toast.error('Error updating profile'); // Show Toastify error notification
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
    } finally {
      setUpdating(false); // End updating
    }
  };

  return (
    <div>
      <Titile />
      <ToastContainer />
      {/* <<<<<<< HEAD */}
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "60%" }}
            >
              <Card.Header>
                <Card.Title className="d-flex justify-content-center">
                  <h3>Staff Details</h3>
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
                      src={`http://localhost:8000${staffDetails.profilePic}`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item style={{ textAlign: "center" }}>
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {staffDetails.staff_name || "Not specified"}
                      </h3>
                    </div>
                    <hr />
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {staffDetails.email}
                      </h3>
                    </div>
                    <hr />
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {staffDetails.gender || "Not specified"}
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
                      <FaUser /> User Name :{" "}
                    </Form.Label>
                    {/* ======= */}
                    {/* <Form.Label>User Name</Form.Label> */}
                    {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                    <Form.Control
                      type="text"
                      name="staff_name"
                      value={formValues.staff_name}
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
                      <HiMail /> Contact :
                    </Form.Label>
                    {/* ======= */}
                    {/* <Form.Group>
                    <Form.Label>Email</Form.Label> */}
                    {/* >>>>>>> 959a3b8c4a74156b45156af0d3d747249948b */}
                    <Form.Control
                      type="number"
                      name="contact"
                      value={formValues.contact}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaImage /> Profile Picture :
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="profilePic"
                      onChange={handleProfilePicChange}
                      accept="image/*"
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
                  {/* ======= */}
                  {/* <Form.Group>
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="profilePic"
                      onChange={handleProfilePicChange}
                      accept="image/*"
                    />
                  </Form.Group>
                  <br />
                  <Button variant="primary" type="submit" disabled={updating}>
                    {updating ? <Spinner as="span" animation="border" size="sm" /> : 'Save Changes'}
                  </Button> */}
                  {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaUpdate;
