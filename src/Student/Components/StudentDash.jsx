import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSideNav from './StudentSideNav';
import Titile from '../../Home/Components/Titile';
// <<<<<<< HEAD
import { ListGroup, Table, Spinner, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Statastics from '../../Admin/Components/Statastics';
// =======
// import { ListGroup, Table, Spinner, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

// Custom hook to fetch user details and associated data
const useFetchDetails = () => {
  const [data, setData] = useState({
    username: '',
    email: '',
    course: 'none',
    staffs: 0,
    students: 0,
    subjects: 0,
    studentList: [],
    subjectList: [],
    staffList : []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate()
// <<<<<<< HEAD
// =======

// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  
  useEffect(() => {
    // Prevent back navigation by pushing the same state repeatedly
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, '', window.location.href); // Keep user on admindash
      navigate('/studash', { replace: true }); // Redirect to admindash again
    };
  
    // Push state once on load and set up listener
    window.history.pushState(null, '', window.location.href); // Disable back button
    window.addEventListener('popstate', handlePopState); // Listen for popstate (back navigation)
  
    return () => {
      window.removeEventListener('popstate', handlePopState); // Clean up on component unmount
    };
  }, [navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = JSON.parse(localStorage.getItem('email'));
      try {
        const response = await axios.get(`http://localhost:8000/api/studentdash/?email=${email}`);
        setData({
          username: response.data.username,
          email: email,
          course: response.data.course,
          staffs: response.data.staffs,
          students: response.data.students,
          subjects: response.data.subjects,
          studentList: response.data.student,
          subjectList: response.data.subject,
          staffList : response.data.staff
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  return { data, loading, error };
};

const StudentDash = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { data, loading, error } = useFetchDetails(); // Using the custom hook

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Titile />
      <div className="d-lg-flex">
        <StudentSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="d-lg-flex d-md-block d-sm-block justify-content-between align-items-center">
            <h1>Welcome {data.username}</h1>
            <p>{currentDateTime.toLocaleString()}</p>
          </div>
          <h3>Course Name: {data.course}</h3>

          {loading ? (
            <div className="text-center mt-3">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              {/* <<<<<<< HEAD */}
              <Card style={{ width: "100%" }}>
                <Card.Body>
                  <ListGroup>
                    <ListGroup.Item>
                      Staff Members: {data.staffs}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Students in Course: {data.students}
                    </ListGroup.Item>
                    <ListGroup.Item>Subjects: {data.subjects}</ListGroup.Item>
                  </ListGroup>
                  <h2>Students</h2>
                  <Table striped hover className="mt-3">
                    <thead>
                      <tr>
                        <th>Sno</th>
                        <th>Student Name</th>
                        <th>Student Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.studentList.map((stu, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{stu.student_name}</td>
                          <td>{stu.session}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <h2>Subjects</h2>
                  <Table striped hover className="mt-3">
                    <thead>
                      <tr>
                        <th>Sno</th>
                        <th>Subject Name</th>
                        <th>Staff Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.subjectList.map((sub, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{sub.name}</td>
                          <td>{sub.staff_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Statastics />
              {/* ======= */}
              {/* <h2>Staff Members:</h2>
              <Table className="mt-3">
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Staff Name</th>
                  </tr>
                </thead>
                <tbody>
                  {data.staffList.map((staffMember, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{staffMember.staff_name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h2>Students</h2>
              <Table className="mt-3">
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Student Name</th>
                    <th>Student Session</th>
                  </tr>
                </thead>
                <tbody>
                  {data.studentList.map((stu, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{stu.student_name}</td>
                      <td>{stu.session}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h2>Subjects</h2>
              <Table className="mt-3">
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Subject Name</th>
                    <th>Staff Name</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subjectList.map((sub, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{sub.name}</td>
                      <td>{sub.staff_name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table> */}
              {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// <<<<<<< HEAD
// export default StudentDash;
// =======
export default StudentDash;
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
