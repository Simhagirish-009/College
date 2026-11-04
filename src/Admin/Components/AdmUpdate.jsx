import React, { useState, useEffect } from "react";
import axios from "axios";
import Titile from "../../Home/Components/Titile";
import { Button, Card, Modal, Form, ListGroup, Image } from "react-bootstrap";
import "../../App.css";
import {
  FaUser,
  FaLock,
  FaVenusMars,
  FaMapMarkerAlt,
  FaImage,
  FaPlus,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const AdmUpdate = () => {
  const [adminDetails, setAdminDetails] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    profilePic: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState(adminDetails);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [adminFormValues, setAdminFormValues] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    contact: "",
    profilePic: "",
  });

  const email = JSON.parse(localStorage.getItem("email"));

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/admin/?email=${email}`
        );
        const data = response.data;
        setAdminDetails({
          id: data.details.id,
          username: data.details.username,
          email: data.details.email,
          gender: data.details.gender,
          address: data.details.address,
          profilePic: data.details.profile_pic,
          contact: data.details.contact,
        });
        setFormValues({
          id: data.details.id,
          username: data.details.username,
          email: data.details.email,
          gender: data.details.gender,
          address: data.details.address,
          profilePic: data.details.profile_pic,
          contact: data.details.contact,
        });
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    if (email) {
      fetchAdminDetails();
    }
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormValues({ ...adminFormValues, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", formValues.username);
      formData.append("email", formValues.email);
      formData.append("gender", formValues.gender);
      formData.append("address", formValues.address);
      formData.append("contact", formValues.contact);
      // Append profile picture if a new one is selected
      if (profilePicFile) {
        formData.append("profile_pic", profilePicFile);
      }

      const response = await axios.put(
        `http://localhost:8000/api/admin/${formValues.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAdminDetails({ ...formValues, profilePic: response.data.profile_pic });
      alert("Admin Edited Successfully")
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", adminFormValues.username);
      formData.append("email", adminFormValues.email);
      formData.append("password", adminFormValues.password);
      formData.append("gender", adminFormValues.gender);
      formData.append("address", adminFormValues.address);
      formData.append("contact", adminFormValues.contact);

      await axios.post(`http://localhost:8000/api/addadmin/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAdminModal(false);
      setAdminFormValues({
        username: "",
        email: "",
        password: "",
        gender: "",
        address: "",
        profilePic: "",
      });
      alert("Admin Added Successfully")
    } catch (error) {
      console.error("Error adding admin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">

        <div className="dash flex-grow-1 p-3">
          <div className="btnn px-2 d-flex flex-reverse">
            <br />
            <Button className="bttn px-5" onClick={() => setAdminModal(true)}>
              <FaPlus /> Add Admin
            </Button>
          </div>
          <div className="dash-container">
            {/* Existing admin profile card */}
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "60%" }}
            >
              <Card.Header>
                <Card.Title className="d-flex justify-content-center">
                  <h3>Admin Details</h3>
                </Card.Title>
              </Card.Header>
              <Card.Body className="p-5">
                <ListGroup>
                  <ListGroup.Item className="d-flex flex-column align-items-center">
                    <Image
                      className="animate__animated animate__zoomIn"
                      roundedCircle
                      height={200}
                      width={200}
                      alt="prifile_pic"
                      src={`http://localhost:8000${adminDetails.profilePic}`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item style={{ textAlign: "center" }}>
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {adminDetails.username || "Not specified"}
                      </h3>
                    </div>
                    <hr />
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {adminDetails.email}
                      </h3>
                    </div>
                    <hr />
                    <div className="mb-1">
                      <h3 className="text-secondary mb-0 animate__animated animate__zoomIn">
                        {adminDetails.gender || "Not specified"}
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
                    Update Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
            {/* Modal for updating profile */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton closeVariant="white">

                <Modal.Title>Update Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>
                      <FaUser /> Username :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formValues.username}
                      onChange={handleInputChange}
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
                      value={formValues.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <HiMail /> Contact :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={formValues.contact}
                      minLength={10}
                      maxLength={10}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaVenusMars /> Gender:
                    </Form.Label>
                    <Form.Select
                      name="gender"
                      value={formValues.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Form.Select>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <FaImage /> Profile Picture
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
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <br />
                  <div className="d-flex justify-content-center btnn">
                    <Button
                      className="bttn px-5"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : <span>Update</span>}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
            {/* Modal for adding new admin */}
             <Modal show={adminModal} onHide={() => setAdminModal(false)}>
              <Modal.Header closeButton closeVariant="white">

                <Modal.Title>Add New Admin</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleAdminSubmit}>
                  <Form.Group>
                    <Form.Label>
                      <FaUser /> Username :{" "}
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="username"
                      value={adminFormValues.username}
                      onChange={handleAdminInputChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <HiMail /> Email :{" "}
                    </Form.Label>

                    <Form.Control
                      type="email"
                      name="email"
                      value={adminFormValues.email}
                      onChange={handleAdminInputChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      <FaLock /> Password
                    </Form.Label>

                    <Form.Control
                      type="password"
                      name="password"
                      value={adminFormValues.password}
                      onChange={handleAdminInputChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      <HiMail /> Contact :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={adminFormValues.contact}
                      minLength={10}
                      maxLength={10}
                      onChange={handleAdminInputChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      <FaVenusMars /> Gender :{" "}
                    </Form.Label>

                    <Form.Select
                      name="gender"
                      value={adminFormValues.gender}
                      onChange={handleAdminInputChange}
                      required
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <FaMapMarkerAlt /> Address :{" "}
                    </Form.Label>

                    <Form.Control
                      type="text"
                      name="address"
                      value={adminFormValues.address}
                      onChange={handleAdminInputChange}
                    />
                  </Form.Group>
                  <br />
                  <div className="d-flex justify-content-center btnn">
                    <Button
                      className="bttn px-5"
                      variant="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Register Admin"}

                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmUpdate;