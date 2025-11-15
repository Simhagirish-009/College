// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import StaffSideNav from "./StaffSideBar";
import Titile from "../../Home/Components/Titile";
import axios from "axios";
import { ListGroup, Table, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Statastics from "../../Admin/Components/Statastics";
const StaffDash = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [details, setDetails] = useState({
    username: "",
    email: "",
    course: "none",
    // =======
    // import React, { useState, useEffect } from 'react';
    // import StaffSideNav from './StaffSideBar';
    // import Titile from '../../Home/Components/Titile';
    // import axios from 'axios';
    // import { ListGroup, Table } from 'react-bootstrap';
    // import { useNavigate } from 'react-router-dom';

    // const StaffDash = () => {
    //   const [currentDateTime, setCurrentDateTime] = useState(new Date());
    //   const [details, setDetails] = useState({
    //     username: '',
    //     email: '',
    //     course: 'none',
    // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
    staffs: 0,
    students: 0,
    subjects: 0,
  });
  // <<<<<<< HEAD
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState([]);
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  // =======
  // const [students,setStudents] = useState([])
  // const [subject,setSubject] = useState([])
  // const [staff,setStaff] = useState([])
  // const navigate = useNavigate()

  // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
  useEffect(() => {
    // Prevent back navigation by pushing the same state repeatedly
    const handlePopState = (event) => {
      event.preventDefault();
      // <<<<<<< HEAD
      window.history.pushState(null, "", window.location.href); // Keep user on staffdash
      navigate("/staffdash", { replace: true }); // Redirect to staffdash again
    };

    // Push state once on load and set up listener
    window.history.pushState(null, "", window.location.href); // Disable back button
    window.addEventListener("popstate", handlePopState); // Listen for popstate (back navigation)

    return () => {
      window.removeEventListener("popstate", handlePopState); // Clean up on component unmount
    };
  }, [navigate]);
  // =======
  //     window.history.pushState(null, '', window.location.href); // Keep user on staffdash
  //     navigate('/staffdash', { replace: true }); // Redirect to staffdash again
  //   };

  //   // Push state once on load and set up listener
  //   window.history.pushState(null, '', window.location.href); // Disable back button
  //   window.addEventListener('popstate', handlePopState); // Listen for popstate (back navigation)

  //   return () => {
  //     window.removeEventListener('popstate', handlePopState); // Clean up on component unmount
  //   };
  // }, [navigate]);

  // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      // <<<<<<< HEAD
      const email = JSON.parse(localStorage.getItem("email"));
      try {
        const response = await axios.get(
          `http://localhost:8000/api/count_stu/?email=${email}`
        );
        // =======
        // const email = JSON.parse(localStorage.getItem('email'));
        // try {
        //   const response = await axios.get(`http://localhost:8000/api/count_stu/?email=${email}`);
        // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
        setDetails({
          username: response.data.username,
          email: email,
          course: response.data.course,
          staffs: response.data.staffs,
          students: response.data.students,
          subjects: response.data.subjects,
        });
        // <<<<<<< HEAD
        setStudents(response.data.student);
        setSubject(response.data.subject);
        setStaff(response.data.staff);
      } catch (error) {
        localStorage.clear();
        console.error("Error fetching user details:", error);
        // =======
        //   setStudents(response.data.student)
        //   setSubject(response.data.subject)
        //   setStaff(response.data.staff)
        // } catch (error) {
        //   localStorage.clear()
        //   console.error('Error fetching user details:', error);
        // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div>
      <Titile />
      {/* <<<<<<< HEAD */}
      <div className="d-lg-flex d-md-block d-sm-block">
        {/* // ======= */}
        {/* <div className="d-lg-flex"> */}
        {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="d-lg-flex d-md-flex d-sm-block justify-content-between align-items-center">
            <h1>Welcome {details.username}</h1>
            <p>{currentDateTime.toLocaleString()}</p>
          </div>
          <h3>Course Name: {details.course}</h3>
          {/* <<<<<<< HEAD */}
          <Card style={{ width: "100%" }} className="shadow-md">
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>Staff Members: {details.staffs}</ListGroup.Item>
                <ListGroup.Item>
                  Students in Course: {details.students}
                </ListGroup.Item>
                <ListGroup.Item>Subjects: {details.subjects}</ListGroup.Item>
              </ListGroup>
              <br />
              <h3>Staff members : </h3>
              <Table bordered striped className="mt-3">
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Staff Name </th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((staff, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{staff.staff_name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h3>Students </h3>
              <Table bordered striped className="mt-3">
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Student Name </th>
                    <th>Student Session</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{stu.student_name}</td>
                      <td>{stu.year}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h3>Subjects : </h3>
              <Table bordered striped className="mt-3">
                <thead>
                  <tr>
                    <th>Sno</th>
                    <th>Subject Name </th>
                    <th>Student Session</th>
                  </tr>
                </thead>
                <tbody>
                  {subject.map((sub, index) => (
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
          {/* <ListGroup>
            <ListGroup.Item>Staff Members: {details.staffs}</ListGroup.Item>
            <ListGroup.Item>Students in Course: {details.students}</ListGroup.Item>
            <ListGroup.Item>Subjects: {details.subjects}</ListGroup.Item>
         </ListGroup>
         <h2>Staff members : </h2>
         <Table  className='mt-3'>
          <thead>
            <tr>
            <th>Sno</th>
            <th>Staff Name </th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staff, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{staff.staff_name}</td>
              
            </tr>
              ))}
          </tbody>
         </Table>
         <h2>Students </h2>
         <Table  className='mt-3'>
          <thead>
            <tr>
            <th>Sno</th>
            <th>Student Name </th>
            <th>Student Session</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{stu.student_name}</td>
              <td>{stu.session}</td>
            </tr>
              ))}
          </tbody>
         </Table>
         <h2>Subjects : </h2>
         <Table  className='mt-3'>
          <thead>
            <tr>
            <th>Sno</th>
            <th>Subject Name </th>
            <th>Student Session</th>
            </tr>
          </thead>
          <tbody>
            {subject.map((sub, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{sub.name}</td>
              <td>{sub.staff_name}</td>
            </tr>
              ))}
          </tbody>
         </Table> */}
          {/* >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b */}
        </div>
      </div>
    </div>
  );
};

export default StaffDash;
