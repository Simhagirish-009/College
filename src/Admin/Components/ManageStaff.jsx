// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Card,
  Image,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import { FaEdit , FaTrash , FaToggleOn , FaToggleOff } from "react-icons/fa";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editStaff, setEditStaff] = useState({
    id: "",
    staff_name: "",
    email: "",
    course: "",
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [details, setDetails] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All"); // State for selected course
  const [filteredStaffList, setFilteredStaffList] = useState([]);

  const handleToggleStatus = async (staff) => {
    try {
      const updatedStatus = !staff.is_active;
      await axios.put(`http://localhost:8000/api/staff/${staff.id}/`, {
        is_active: updatedStatus,
      });
      toast.success("Staff status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update staff status");
    }
  };

  const handleShowDetails = async (staff) => {
    const response = await axios.post("http://localhost:8000/api/staff_view/", {
      name: staff.staff_name,
    });
    setSubjects(response.data);
    setDetailModal(true);
    setDetails(staff);
  };
  // Fetch staff list from the API
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          "http://localhost:8000/api/staff_view/"
        );
        setStaffList(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Error fetching staff");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchStaff();
  }, []);

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addcourse/"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  // Handle staff deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/staff/${staffToDelete}/`);
      setStaffList(staffList.filter((staff) => staff.id !== staffToDelete));
      toast.success("Staff deleted successfully!");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Error deleting staff");
    }
  };

  // Handle staff edit modal opening
  const handleEdit = (staff) => {
    setEditStaff({
      id: staff.id,
      staff_name: staff.staff_name,
      email: staff.email,
      course: staff.course,
      contact : staff.contact
        });
    setShowEditModal(true);
  };

  // Handle staff edit submission
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/staff/${editStaff.id}/`,
        editStaff
      );
      setStaffList(
        staffList.map((staff) =>
          staff.id === editStaff.id ? response.data : staff
        )
      );
      setShowEditModal(false);
      toast.success("Staff updated successfully!");
      setEditStaff({ id: "", staff_name: "", email: "", course: "",contact : "" }); // Reset edit staff object
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Error updating staff");
    }
  };
  useEffect(() => {
    if (selectedCourse === "All") {
      setFilteredStaffList(staffList);
    } else {
      setFilteredStaffList(
        staffList.filter((staff) => staff.course_name === selectedCourse)
      );
    }
  }, [selectedCourse, staffList]);
  return (
    <div className="root">
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="d-flex justify-content-between">
            <h2>Manage Staff</h2>
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
            {loading ? ( // Conditional rendering based on loading state
              <Spinner animation="border" variant="primary" />
            ) : (
              <Card className="mt-3" style={{ width: "100%" }}>
                <Card.Header>
                  <Card.Title>Manage Staff Members </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table
                    responsive
                    bordered
                    striped
                    className="table animate__animated animate__slideInUp"
                  >
                    <thead>
                      <tr>
                        <th>Sno</th>
                        <th>Staff Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Subjects</th>
                        <th style={{ textAlign: "center" }}>Edit</th>
                        <th style={{ textAlign: "center" }}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaffList.map((staff, index) => (
                        <tr key={staff.id}>
                          <td>{index + 1}</td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => handleShowDetails(staff)}
                          >
                            {staff.staff_name}
                          </td>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => handleShowDetails(staff)}
                          >
                            {staff.email}
                          </td>
                          <td>{staff.course_name}</td>
                          <td>+91 {staff.contact}</td>
                          <td style={{ textAlign: "center" }}>
                            <Button onClick={() => handleEdit(staff)}>
                              <FaEdit /> Edit
                            </Button>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Button
                              variant="danger"
                              onClick={() => {
                                setStaffToDelete(staff.id);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Edit Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Staff Name</Form.Label>
              <Form.Control
                type="text"
                value={editStaff.staff_name}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, staff_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editStaff.email}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course:</Form.Label>
              <Form.Select
                value={editStaff.course}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, course: e.target.value })
                }
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
            <Form.Group>
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={editStaff.contact}
                maxLength={10}
                minLength={10}
                onChange={(e) =>
                  setEditStaff({ ...editStaff, contact: e.target.value })
                }
              />
            </Form.Group>
            <br />
            <Form.Group className="btnn d-flex justify-content-center">
              <Button
                className="bttn px-5"
                variant="primary"
                onClick={handleEditSubmit}
              >
                Save Changes
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="px-5"
            variant="danger"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this staff member?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={detailModal} onHide={() => setDetailModal(false)} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Staff Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center mb-3">
            <Image
              roundedCircle
              height={120}
              width={120}
              src={`http://localhost:8000${details.profile_pic}`}
              alt="Profile Picture"
            />
            <h4 className="mt-2">{details.staff_name}</h4>
            <p className="text-muted">
              {details.course_name || "Course not assigned"}
            </p>
          </div>
          <Card className="shadow-sm p-3 mb-3 container">
            <div className="mb-1">
              <h6 className="mb-1">Email:</h6>
              <p className="text-secondary mb-0">{details.email}</p>
            </div>
            <hr />
            <div className="mb-1">
              <h6 className="mb-1">Gender:</h6>
              <p className="text-secondary mb-0">
                {details.gender || "Not specified"}
              </p>
            </div>
            <hr />
            <div className="mb-1">
              <h6 className="mb-1">Course:</h6>
              <p className="text-secondary mb-0">
                {details.course_name || "Not specified"}
              </p>
            </div>
            <hr />
            <div className="mb-1">
              <h6 className="mb-1">Assigned Subjects:</h6>
              <p className="text-secondary mb-0">
                {subjects.length > 0
                  ? subjects.map((sub, index) => (
                      <span key={index}>
                        {sub.name}
                        {index < subjects.length - 1 && ", "}
                      </span>
                    ))
                  : "No subjects assigned"}
              </p>
            </div>
            <hr />
            <div className="mb-1">
              <h6 className="mb-1">Contact Number:</h6>
              <p className="text-secondary mb-0">
                +91 {details.contact || "Not provided"}
              </p>
            </div>
            <hr />
            <div className="mb-1">
              <h6 className="mb-1">Address:</h6>
              <p className="text-secondary mb-0">
                {details.address || "Not provided"}
              </p>
            </div>
            <hr />
            <div className="mb-1">
              <Button
                variant={details.is_active ? "success" : "secondary"}
                onClick={() => handleToggleStatus(details)}
              >
                {details.is_active ? <FaToggleOn /> : <FaToggleOff />}{" "}
                {details.is_active ? "Active" : "Inactive"}
              </Button>
            </div>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="px-5"
            variant="danger"
            onClick={() => setDetailModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageStaff;
