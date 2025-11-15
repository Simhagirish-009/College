// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import {
  Image,
  Alert,
  Button,
  Form,
  Modal,
  Card,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPaperPlane } from "react-icons/fa";
import "../../App.css";

const NotifyStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [show, setShow] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [filteredStaffList, setFilteredStaffList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffResponse = await axios.get(
          "http://localhost:8000/api/staff_view/"
        );
        setStaffList(staffResponse.data);

        const courseResponse = await axios.get(
          "http://localhost:8000/api/addcourse/"
        );
        setCourses(courseResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCourse === "All") {
      setFilteredStaffList(staffList);
    } else {
      setFilteredStaffList(
        staffList.filter((staff) => staff.course_name === selectedCourse)
      );
    }
  }, [selectedCourse, staffList]);

  const handleCheckboxChange = (staffId) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStaff([]);
    } else {
      const allStaffIds = staffList.map((staff) => staff.id);
      setSelectedStaff(allStaffIds);
    }
    setSelectAll(!selectAll);
  };

  const showModal = () => {
    if (selectedStaff.length === 0) {
      toast.warn(`Please select at least one staff to notify`);
    } else {
      setShow(true);
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        staff_ids: selectedStaff,
        email_content: emailContent,
      };

      const response = await axios.post(
        "http://localhost:8000/api/send_email_staff/",
        data
      );

      if (response.status === 201) {
        toast.success("Notification sent successfully.");
      } else if (response.status === 206) {
        toast.warning(response.data.success);
      }

      setEmailContent("");
      setShow(false);
      setSelectedStaff([]);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification.");
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
          <h2>Notify Staff</h2> <br />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="btnn">
              <Button className="bttn px-5" onClick={showModal}>
                <FaPaperPlane /> Send Notification
              </Button>
            </div>
            <Form.Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="All">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="dash-container mt-3">
            <Card
              className="mt-3 animate__animated animate__fadeIn"
              style={{ width: "100%" }}
            >
              <Card.Header>
                <Card.Title className="d-flex justify-content-between">
                  Staff Profiles
                  <Form.Check
                    type="checkbox"
                    label="Select All"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="staff-list-container animate__animated animate__fadeIn">
                  {filteredStaffList.map((staff, index) => (
                    <div
                      className={`chat mb-2 d-flex align-items-center p-2 rounded border ${
                        selectedStaff.includes(staff.id)
                          ? "bg-info-subtle"
                          : "bg-light"
                      }`}
                      key={index}
                      style={{
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onClick={() => handleCheckboxChange(staff.id)}
                    >
                      <Form.Check
                        className="me-3"
                        type="checkbox"
                        checked={selectedStaff.includes(staff.id)}
                        onChange={() => handleCheckboxChange(staff.id)}
                      />
                      <Image
                        roundedCircle
                        height={50}
                        width={50}
                        src={`http://localhost:8000${staff.profile_pic}`}
                        alt="Profile Picture"
                        className="me-3 border"
                      />
                      <div className="staff-info d-flex justify-content-between align-items-center w-100">
                        <div>
                          <h5 className="mb-0">{staff.staff_name}</h5>
                          <small className="text-muted">{staff.email}</small>
                        </div>
                        <p className="mb-0">{staff.course_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
          {error && (
            <Alert variant="danger">
              <p className="text-danger">{error}</p>
            </Alert>
          )}
        </div>

        {/* Modal for sending notification */}
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Send Notification to Selected Staff</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSendMail}>
              <Form.Group>
                <Form.Label>Notification Content:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Type your message here"
                  required
                />
              </Form.Group>
              <br />
              <Form.Group className="form-group justify-content-center d-flex">
                <Button className="px-5 py-2" type="submit" disabled={loading}>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <span>
                      <FaPaperPlane /> Send Notification
                    </span>
                  )}
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              className="px-5"
              onClick={() => setShow(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
}
export default NotifyStaff;
