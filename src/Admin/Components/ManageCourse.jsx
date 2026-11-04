import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import Titile from "../../Home/Components/Titile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit , FaTrash , FaPlus } from "react-icons/fa";
import axios from "axios";

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourse, setEditCourse] = useState({ id: "", name: "" });
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [courseToDelete, setCourseToDelete] = useState(null); // Store course to delete

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addcourse/"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setMessage("Error fetching courses");
        toast.error("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteConfirm = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8000/api/addcourse/${courseToDelete.id}/`
      );
      setCourses(courses.filter((course) => course.id !== courseToDelete.id));
      toast.success("Course Deleted Successfully");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting course:", error);
      setMessage("There are staff members currently in this course");
      toast.error("There was an error while deleting");
    } finally {
      setLoading(false);
      setCourseToDelete(null);
    }
  };

  const showModal = () => {
    setShow(true);
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/addcourse/${editCourse.id}/`, {
        name: editCourse.name,
      });
      const updatedCourses = courses.map((course) =>
        course.id === editCourse.id
          ? { ...course, name: editCourse.name }
          : course
      );
      setCourses(updatedCourses);
      setShowEditModal(false);
      toast.success("Course Updated Successfully");
    } catch (error) {
      console.error("Error updating course:", error);
      setMessage("Error updating course");
      toast.error("Error While Editing The Course");
    } finally {
      setLoading(false);
    }
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/addcourse/",
        { name }
      );
      setName("");
      setCourses([...courses, response.data]);
      setShow(false);
      toast.success("Course Added successfully");
    } catch (error) {
      setName("");
      toast.error("Course Adding Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <Titile />
      <ToastContainer />
      <div className="d-lg-flex d-md-block d-sm-block">

        <div className="flex-grow-1 p-3">
          <h2>Manage Courses</h2> <br />
          <div className="btnn">
            <Button className="bttn px-5" onClick={showModal}>
              <FaPlus /> Add Course
            </Button>
            <br />
          </div>
          <div className="dash-container mt-3">
            <Card className="mt-3" style={{ width: "100%" }}>
              <Card.Header>
                <Card.Title>Manage Courses</Card.Title>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Table
                    bordered
                    striped
                    hover
                    className="animate__animated animate__slideInUp"
                  >
                    <thead>
                      <tr style={{ textAlign: "center" }}>
                        <th>Sno</th>
                        <th>Course Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, index) => (
                        <tr key={index} style={{ textAlign: "center" }}>
                          <td>{index + 1}</td>
                          <td>{course.name}</td>
                          <td>
                            <Button onClick={() => handleEdit(course)}>
                              <FaEdit /> Edit
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteConfirm(course)}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </div>
          {message && (
            <Alert variant="danger">
              <p className="text-danger">{message}</p>
            </Alert>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandle}>
            <Form.Group>
              <Form.Label>Course Name :</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Add course code"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <br />
            <div className="btnn d-flex justify-content-center">
              <Button className="bttn px-5" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Add Course"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Course Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                value={editCourse.name}
                onChange={(e) =>
                  setEditCourse({ ...editCourse, name: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="px-5"
            variant="secondary"
            onClick={() => setShowEditModal(false)}
          >
            Close
          </Button>
          <Button
            className="px-5"
            variant="primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Update"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the course "{courseToDelete?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageCourse;
