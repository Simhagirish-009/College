// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideNav from "./AdminSideNav";
import Titile from "../../Home/Components/Titile";
import { Button, Card, Spinner } from "react-bootstrap";
import StaffIcon from "../../assets/images/teacher.png";
import StudentIcon from "../../assets/images/graduated.png";
import CourseIcon from "../../assets/images/course.png";
import SubjectIcon from "../../assets/images/subject.png";
import Statastics from "./Statastics";
import Foot from "../../Home/Components/Foot";

const AdminDash = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [count, setCount] = useState({});
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);

  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch admin details
  const fetchAdminDetails = async () => {
    const email = JSON.parse(localStorage.getItem("email"));
    try {
      const response = await axios.get(
        `http://localhost:8000/api/count/?email=${email}`
      );
      setDetails({
        username: response.data.username,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [countRes] = await Promise.all([
        axios.get("http://localhost:8000/api/count/"),
      ]);
      setCount(countRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAdminDetails();
    fetchDashboardData();
  }, []);

  // Chart configurations

  return (
    <div className="root">
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <AdminSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Welcome {details.username}</h1>
            <p>{currentDateTime.toLocaleString()}</p>
          </div>

          

          {/* Loading Spinner */}
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {/* Dashboard Cards */}
              <div className="dash-card-container d-lg-flex d-md-flex d-sm-block mt-4">
                {[
                  {
                    title: "Manage Students",
                    count: count.students || 0,
                    icon: StudentIcon,
                    link: "/mngstu/",
                  },
                  {
                    title: "Manage Staff",
                    count: count.staffs || 0,
                    icon: StaffIcon,
                    link: "/mngstaff/",
                  },
                  {
                    title: "Manage Courses",
                    count: count.courses || 0,
                    icon: CourseIcon,
                    link: "/mngcourse/",
                  },
                  {
                    title: "Manage Subjects",
                    count: count.subjects || 0,
                    icon: SubjectIcon,
                    link: "/mngsub/",
                  },
                ].map(({ title, count, icon, link }, index) => (
                  <Card className="dash-card" key={index}>
                    <Card.Header style={{ textAlign: "center" }}>
                      {title}
                    </Card.Header>
                    <Card.Body className="text-center">
                      <img
                        src={icon}
                        alt={title}
                        height={100}
                        className="mb-3"
                      />
                      <h3>{count}</h3>
                      <Button variant="primary">
                        <a
                          href={link}
                          style={{ color: "white", textDecoration: "none" }}
                        >
                          View More
                        </a>
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              <Statastics />
            </>
          )}
          <Foot />
{/* // ======= */}
{/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSideNav from './AdminSideNav';
import Titile from '../../Home/Components/Titile';
import { Button, Card , ListGroup, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'animate.css';

const AdminDash = () => {
  const [currentDateTime, setcurrentDateTime] = useState(new Date());
  const [count, setCount] = useState({
    staff: '',
    student: '',
    course: '',
    subject: '',
    feedback_student : '',
    feedback_staff : '',
    leave_staff : '',
    leave_student : '',
  });
  const [details, setDetails] = useState({
    username: '',
    email: '',
  });
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setcurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
        setLoading(true);  // Set loading to true before fetching
        try {
            const response = await axios.get('http://localhost:8000/api/staff_view/');
            setStaffList(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);  // Set loading to false after fetching
        }
    };
    const fetchStudents = async () => {
      setLoading(true); // Start loading
      try {
          const response = await axios.get('http://localhost:8000/api/student_view/');
          setStudentList(response.data);
      } catch (error) {
          console.error("Error fetching students:", error);
      } finally {
          setLoading(false); // Stop loading
      }
   };
    fetchStudents()
    fetchStaff();
}, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get('http://localhost:8000/api/count/');
        setCount({
          staff: response.data.staffs,
          student: response.data.students,
          course: response.data.courses,
          subject: response.data.subjects,
          feedback_staff : response.data.feedback_staff,
          feedback_student : response.data.feedback_student,
          leave_staff : response.data.leave_staff,
          leave_student : response.data.leave_student,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    const fetchAdmin = async () => {
      const email = JSON.parse(localStorage.getItem('email'));
      try {
        setLoading(true); // Start loading
        const response = await axios.get(
          `http://localhost:8000/api/count/?email=${email}`
        );
        setDetails({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (error) {
        console.error('Error fetching admin details:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAdmin();
    fetchCounts();
  }, []);

  const handleAddStudent = () => {
    navigate('/add-student'); // Navigate to Add Student page
  };

  return (
    <div>
      <Titile />
      <div className="d-lg-flex">
        <AdminSideNav />
        <div className="dash flex-grow-1">
          <div className="d-lg-flex d-md-flex d-sm-block justify-content-between align-items-center">
            <h1>Welcome {details.username}</h1>
            <p>{currentDateTime.toLocaleString()}</p>
          </div>
          <div className="mt-4">
            <div className="dash-card-container d-lg-flex d-md-flex d-sm-flex">
              <Card className="dash-card animate__animated animate__fadeIn">
                <Card.Header>Total Students</Card.Header>
                <Card.Body>
                  <h3>Total Students: {count.student}</h3>
                  <br />
                  <Button onClick={handleAddStudent} disabled={loading}>
                    {loading ? 'Loading...' : 'Add Student'}
                  </Button>
                </Card.Body>
              </Card>
              <Card className="dash-card animate__animated animate__fadeIn">
                <Card.Header>Total Staff</Card.Header>
                <Card.Body>
                  <h3>Total Staff: {count.staff}</h3>
                  <br />
                  <Button>View More</Button>
                </Card.Body>
              </Card>
            </div>
            <br />
            <div className="dash-card-container d-lg-flex d-md-flex d-sm-flex">
              <Card className="dash-card animate__animated animate__fadeIn">
                <Card.Header>Total Courses</Card.Header>
                <Card.Body>
                  <h3>Total Courses: {count.course}</h3>
                  <br />
                  <Button>View More</Button>
                </Card.Body>
              </Card>
              <Card className="dash-card animate__animated animate__fadeIn">
                <Card.Header>Total Subjects</Card.Header>
                <Card.Body>
                  <h3>Total Subjects: {count.subject}</h3>
                  <br />
                  <Button>View More</Button>
                </Card.Body>
              </Card>
            </div><br/>
            <div className='d-flex justify-content-center'>
              <ListGroup  style={{width : '90%'}}>
                <ListGroup.Item className='p-3 d-flex justify-content-between'><div>Unread FeedBack Notifications of Students</div> {count.feedback_student} </ListGroup.Item>
                <ListGroup.Item className='p-3 d-flex justify-content-between'><div>Unread FeedBack Notifications of Staff</div>  {count.feedback_staff}</ListGroup.Item>
                <ListGroup.Item className='p-3 d-flex justify-content-between'><div>Unreplied Leave requests of Students</div> {count.leave_student}</ListGroup.Item>
                <ListGroup.Item className='p-3 d-flex justify-content-between'><div>Unreplied Leave requests of Staff</div>  {count.leave_staff}</ListGroup.Item>
              </ListGroup>
            </div><br/>
            <div className='d-flex justify-content-center'>
            <Card style={{width : '90%'}} >
              <Card.Body>
                <h3>Staffs in College : {count.staff}</h3><br/>
                <Table bordered striped hover className='animate__animated animate__slideInUp'>
                  <thead>
                    <tr>
                      <th>Sno</th>
                      <th>Staff Name</th>
                      <th>Email</th>
                      <th>Course</th>
                    </tr>
                  </thead>
                  <tbody>
                  {staffList.map((staff, index) => (
                    <tr key={staff.id}>
                      <td>{index + 1}</td>
                      <td>{staff.staff_name}</td>
                      <td>{staff.email}</td>
                      <td>{staff.course_name}</td>               
                    </tr>
                    ))}
                  </tbody>
                </Table><br/>
                <h3>Students in College : {count.student}</h3><br/>
                <Table bordered striped hover className='animate__animated animate__slideInUp'>
                  <thead>
                    <tr>
                    <th>Sno</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Start Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentList.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.student_name}</td>
                      <td>{student.email}</td>
                      <td>{student.course_name}</td>
                      <td>{student.session_start}</td>
                    </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
            </div>
          </div> */}
{/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
