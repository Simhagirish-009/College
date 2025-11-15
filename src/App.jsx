// <<<<<<< HEAD
import React from "react";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
import "animate.css";
import NavBar from "./Home/Components/NavBar";
import Footer from "./Home/Components/Footer";
import "./App.css";
// import College from "../src/assets/images/Form-background.jpg";

const App = () => {
  return (
    <div className="page-container ">
      <NavBar />
      <section className="main-section ">
        <div className="welcome-message ">
          <h1>Welcome to Our College</h1>
          <p>
            Your future starts here. Join us and explore endless opportunities.
          </p>
          <div className="btnn" style={{ textAlign: "center" }}>
            <Button
              className="bttn px-5"
              onClick={() => window.open("/contact/")}
            >
              Contact Now
            </Button>
          </div>
        </div>
      </section>
      <hr />
      <section className="programs-section">
        <h2>Our Programs</h2>
        <p>
          We offer a variety of programs to help you achieve your academic
          goals.
        </p>
        <div className="card-container">
          <Card className="card animate__animated animate__zoomIn shadow-lg">
            <Card.Header>
              <Card.Title>Undergraduate Programs</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>Coming Soon...</p>
            </Card.Body>
          </Card>
          <Card className="card animate__animated animate__zoomIn shadow-lg">
            <Card.Header>
              <Card.Title>Graduate Programs</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>Coming Soon...</p>
            </Card.Body>
          </Card>
          <Card className="card animate__animated animate__zoomIn shadow-lg">
            <Card.Header>
              <Card.Title>Professional Certifications</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>Coming Soon...</p>
            </Card.Body>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;
// =======
// import React from "react";
// import { Button } from "react-bootstrap";
// import { Card } from "react-bootstrap";
// import "animate.css";
// import NavBar from "./Home/Components/NavBar";
// import Footer from "./Home/Components/Footer";
// import "./App.css";

// const App = () => {
//   return (
//     <div className="page-container ">
//       <NavBar />
//       <section className="main-section ">
//         <div className="welcome-message ">
//           <h1>Welcome to Our College</h1>
//           <p>
//             Your future starts here. Join us and explore endless opportunities.
//           </p>
//           <div className="btnn">
//             <Button
//               className="bttn px-5"
//               onClick={() => window.open("/contact/")}
//             >
//               Contact Now
//             </Button>
//           </div>
//         </div>
//       </section>
//       <hr />
//       <section className="programs-section">
//         <h2>Our Programs</h2>
//         <p>
//           We offer a variety of programs to help you achieve your academic
//           goals.
//         </p>
//         <div className="card-container">
//           <Card className="card animate__animated animate__zoomIn shadow-lg">
//             <Card.Header>
//               <Card.Title>Undergraduate Programs</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <p>Coming Soon...</p>
//             </Card.Body>
//           </Card>
//           <Card className="card animate__animated animate__zoomIn shadow-lg">
//             <Card.Header>
//               <Card.Title>Graduate Programs</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <p>Coming Soon...</p>
//             </Card.Body>
//           </Card>
//           <Card className="card animate__animated animate__zoomIn shadow-lg">
//             <Card.Header>
//               <Card.Title>Professional Certifications</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <p>Coming Soon...</p>
//             </Card.Body>
//           </Card>
//         </div>
//       </section>
//       <hr />

//       <section className="events-section">
//         <h2>Upcoming Events</h2>
//         <p>Stay tuned for upcoming college events and activities.</p>
//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default App;
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
