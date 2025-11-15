// <<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Navbar, Container, Image, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Titile = () => {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const email = JSON.parse(localStorage.getItem("email"));
  const role = JSON.parse(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!email) return;

        let endpoint = "";
        if (role === 1) {
          endpoint = `http://localhost:8000/api/admin/?email=${email}`;
        } else if (role === 2) {
          endpoint = `http://localhost:8000/api/staff_details/?email=${email}`;
        } else if (role === 3) {
          endpoint = `http://localhost:8000/api/student_details/?email=${email}`;
        }

        if (!endpoint) return;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
        if (data?.details) {
          setUserName(
            data.details.username ||
              data.details.staff_name ||
              data.details.student_name ||
              " "
          );
          setProfilePic(data.details.profile_pic || "/default-profile.png");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDoubleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const getProfileUpdateLink = () => {
    if (role === 1) return "/admpdate/";
    if (role === 2) return "/stafupdate/";
    if (role === 3) return "/stuupdate/";
    return "/";
  };

  return (
    <Navbar
      variant="dark"
      sticky="top"
      expand="lg"
      className="dash-title py-3 shadow-md d-flex justify-content-between"
    >
      <Container fluid>
        <h3 style={{ color: "white" }}>College Management System</h3>
        {userName && (
          <div className="user-info d-flex align-items-center position-relative">
            <h3 style={{ color: "white" }}>Welcome {userName}</h3>
            <Image
              src={`http://localhost:8000${profilePic}`}
              roundedCircle
              style={{
                marginLeft: "50px",
                width: "50px",
                height: "50px",
                objectFit: "cover",
                border: "1px solid white",
                cursor: "pointer",
              }}
              alt="Profile"
              onDoubleClick={handleDoubleClick}
            />

            {showDropdown && (
              <Dropdown.Menu
                show
                className="position-absolute"
                style={{
                  top: "60px",
                  right: "0px",
                  padding : "0px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Dropdown.Item
                  href={getProfileUpdateLink()}
                  style={{ color: "#1e3a8a" }}
                >
                  Update Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  style={{ color: "#1e3a8a" }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            )}
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default Titile;
// =======
// import React from 'react'
// import { Navbar , Container } from 'react-bootstrap'

// const Titile = () => {
//   return (
//     <Navbar variant='dark' sticky='top' expand="lg" className='dash-title'>
//       <Container fluid>
//         <h3 style={{color : 'white'}}>College Management System</h3>
//       </Container>
//     </Navbar>
//   )
// }

// export default Titile
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
