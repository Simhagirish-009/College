// <<<<<<< HEAD
import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Card } from "react-bootstrap";

import "../../App.css";
import College from "../../assets/images/Form-background.jpg";
const About = () => {
  return (
    <div>
      <NavBar />
      <div className="page-container">
        <h1 style={{ textAlign: "center", color: "#1e3a8a", padding: "10px" }}>
          ABC Institution of Engineering & Technology
        </h1>

        <div className="about-main">
          <div className="sec-1">
            <div className="para">
              <h1>About our College</h1>
              Founded with a vision to empower students through quality
              education, [College Name] has been a leader in academic excellence
              for over [X] years. Our mission is to provide a nurturing and
              inclusive learning environment that fosters intellectual
              curiosity, critical thinking, and holistic development. With a
              diverse range of programs, state-of-the-art facilities, and a
              highly qualified faculty, we are committed to preparing students
              for success in an ever-evolving global landscape. Whether you're
              pursuing undergraduate, postgraduate, or professional education,
              we offer comprehensive resources and personalized support to help
              you achieve your academic and career goals
            </div>
            <img className="image shadow-lg" src={College} alt="College" />
          </div>
        </div>
      </div>
      <hr />
      <section className="programs-section">
        <h2>Facilities We Provide</h2>
        <p>
          We offer a variety of programs to help you achieve your academic
          goals.
        </p>
        <div className="card-container">
          <Card className="card animate__animated animate__zoomIn shadow-lg">
            <Card.Header>
              <Card.Title>Digital Library</Card.Title>
            </Card.Header>
            <Card.Body>
              {/* <img src={Library}/> */}
              <p>Coming Soon...</p>
            </Card.Body>
          </Card>
          <Card className="card animate__animated animate__zoomIn shadow-lg">
            <Card.Header>
              <Card.Title>Sports</Card.Title>
            </Card.Header>
            <Card.Body>
              {/* <img src={Sports}/> */}
              <p>Coming Soon...</p>
            </Card.Body>
          </Card>
          <Card className="card animate__animated animate__zoomIn shadow-lg">
            <Card.Header>
              <Card.Title>Quality Education</Card.Title>
            </Card.Header>
            <Card.Body>
              {/* <img src={Edu}/> */}
              <p>Coming Soon...</p>
            </Card.Body>
          </Card>
        </div>
      </section>

      <hr />
      <section>
        <div className="about-bottom">
          <h2 style={{ textAlign: "center" }}>We Believe</h2>
          At [College Name], we believe in fostering a strong sense of
          community, where every student has the opportunity to explore their
          passions, engage in meaningful extracurricular activities, and
          contribute to society. Our graduates are equipped with the skills and
          values needed to excel in their chosen fields and make a positive
          impact on the world. Join us at [College Name], where your future
          begins!
        </div>
      </section>
      <section></section>
      <Footer />
    </div>
  );
};

export default About;
// =======
// import React from 'react'
// import NavBar from './NavBar'
// import Footer from './Footer'
// import { Button , Card  } from 'react-bootstrap'
// import Sports from '../../assets/images/sports.png'
// import Edu from '../../assets/images/edu.png'
// import Library from '../../assets/images/library.png'
// import '../../App.css'
// import College from '../../assets/images/Form-background.jpeg'
// const About = () => {
//   return (
//     <div>
//       <NavBar/>
//       <div className='page-container'>
//       <h1 style={{textAlign : 'center',color : '#1e3a8a',padding : '10px'}}>ABC Institution of Engineering & Technology</h1>

//         <div className='about-main'>
          
//           <div className='sec-1'>
//             <div className='para'>
//             <h1>About our College</h1>
//               Founded with a vision to empower students through quality education, [College Name] has been a leader in academic excellence for over [X] years.
//               Our mission is to provide a nurturing and inclusive learning environment that fosters intellectual curiosity, critical thinking, and holistic development.
//               With a diverse range of programs, state-of-the-art facilities, and a highly qualified faculty, we are committed to preparing students for success in an ever-evolving global landscape. Whether you're pursuing undergraduate, postgraduate, or professional education, 
//           we offer comprehensive resources and personalized support to help you achieve your academic and career goals
//               </div>
//               <img className='image shadow-lg' src={College} alt='College'/>
//           </div>
//         </div>
//       </div>
//       <hr/>
//       <section className="programs-section">
//         <h2>Facilities We Provide</h2>
//         <p>We offer a variety of programs to help you achieve your academic goals.</p>
//         <div className='card-container'>
//         <Card className='card animate__animated animate__zoomIn shadow-lg'>
//           <Card.Header >
//             <Card.Title>Digital Library</Card.Title>
//           </Card.Header>
//           <Card.Body>
//             <img src={Library}/>
//             <p>Coming Soon...</p>
//           </Card.Body>
//         </Card>
//         <Card className='card animate__animated animate__zoomIn shadow-lg'>
//           <Card.Header >
//             <Card.Title>Sports</Card.Title>
//           </Card.Header>
//           <Card.Body>
//             <img src={Sports}/>
//           <p>Coming Soon...</p>
//           </Card.Body>
//         </Card>
//         <Card className='card animate__animated animate__zoomIn shadow-lg'>
//           <Card.Header >
//             <Card.Title>Quality Education</Card.Title>
//           </Card.Header>
//           <Card.Body>
//             <img src={Edu}/>
//           <p>Coming Soon...</p>
//           </Card.Body>
//         </Card>
//         </div>
//       </section>
      
//       <hr/>
//       <section>
//         <div className='about-bottom'>
//         <h2 style={{textAlign : 'center'}}>We Believe</h2>
//         At [College Name], we believe in fostering a strong sense of community,
//         where every student has the opportunity to explore their passions, 
//         engage in meaningful extracurricular activities, and contribute to society.
//         Our graduates are equipped with the skills and values needed to excel in their chosen fields and make a positive impact on the world.
//         Join us at [College Name], where your future begins!
//         </div>
//       </section>
//       <section>
        
//       </section>
//       <Footer/>
//     </div>
//   )
// }

// export default About
// // >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b
