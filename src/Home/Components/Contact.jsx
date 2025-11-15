import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { Card } from 'react-bootstrap'
import 'animate.css'
const Contact = () => {
  return (
    <div>
        <NavBar/>
        <div className='page-container'>
            <div className='address p-4'>
                <h2 className='px-5 py-2'>Contact Us for More Information</h2>
                <Card className='animate__animated animate__zoomIn' style={{width : '50%' }}>
                    <Card.Body className='p-5'>
                        <h2>Address</h2>
                        <p style={{lineHeight : '30px',fontSize : '20px'}}>
                        ABC College of Engineering and Technology<br/>
                        1234 University Drive<br/>
                        Cityville, State, 56789<br/>
                        Country<br/>

                        Phone: (123) 456-7890<br/>
                        Email: info@abccollege.edu<br/>

                        </p>
                    </Card.Body>
                    
                </Card>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Contact