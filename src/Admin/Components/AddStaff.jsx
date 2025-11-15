// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify
import "../../App.css";
import {
  FaUser,
  FaLock,
  FaVenusMars,
  FaBook,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    contact: "",
    password: "",
    confirmPassword: "",
    address: "",
    course: "",
  });

  const {
    first_name,
    last_name,
    email,
    gender,
    contact,
    password,
    confirmPassword,
    address,
    course,
  } = formData;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // <<<<<<< HEAD
        const response = await axios.get(
          "http://localhost:8000/api/addcourse/"
        );
        setCourses(response.data);
      } catch (error) {
        toast.error("Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // <<<<<<< HEAD
    if (confirmPassword != password) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const staffData = new FormData();
      const staffName = first_name + " " + last_name;
      staffData.append("staff_name", staffName);
      staffData.append("email", email);
      staffData.append("password", password);
      staffData.append("gender", gender);
      staffData.append("contact", contact);
      staffData.append("address", address);
      staffData.append("course", course);

      await axios.post("http://localhost:8000/api/addstaff/", staffData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Staff registered successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        contact: "",
        password: "",
        address: "",
        course: "",
      });
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      toast.error(
        `${error.response?.data.email || error.response?.data.password}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "85%" }}
            >
              <Card.Header>
                <Card.Title>Add Staff</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {/* Form Fields */}
                  <Form.Group>
                    <Form.Label>
                      <FaUser /> First Name:
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
                      <FaUser /> Last Name:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={last_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>
                      <HiMail /> Email:
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
                      <FaVenusMars /> Gender:
                    </Form.Label>
                    <Form.Select
                      name="gender"
                      value={gender}
                      onChange={handleChange}
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
                      <FaLock /> Password:
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
                      <FaLock /> Confirm Password:
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
                      <FaBook /> Course:
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
                      <FaMapMarkerAlt /> Address:
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
                      {loading ? (
                        <div>
                          please wait...
                          <Spinner animation="border" size="sm" />
                        </div>
                      ) : (
                        "Register Staff"
                      )}
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
