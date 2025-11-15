import React, { useState, useEffect } from 'react';
import { Table, Alert, Card ,Form} from 'react-bootstrap';
import StudentSideNav from './StudentSideNav';
import Titile from '../../Home/Components/Titile';
import axios from 'axios';

const ViewResult = () => {
    const [results, setResults] = useState([]); // State for results
    // const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const email = JSON.parse(localStorage.getItem('email')); // Get the email from local storage
    // const [units,setUnits] = useState([])
    const [unit,setUnit] = useState("");
    const [percentage,setPercentage] = useState(null)
    
    useEffect(() => {
        if ( !unit) return;
        const fetchResults = async () => {
            try {
                const cleanedEmail = email.replace(/^"|"$/g, ''); // Remove quotes from email
                const response = await axios.get(`http://localhost:8000/api/view_result/?email=${cleanedEmail}&unit=${unit}`);
                setResults(response.data || []); // Set results data
                setPercentage(response.data[0].percentage);
            } catch (error) {
                console.error("Error fetching results data", error);
                setError("Failed to load results data");
             }
        };
        fetchResults();
    }, [unit,email]);

    return (
      <div>
        <Titile />
        <div className="d-lg-flex d-md-block d-sm-block">
          <StudentSideNav />
          <div className="flex-grow-1 p-3">
            {error && <Alert variant="danger">{error}</Alert>}
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "100%" }}
            >
              <Card.Header>
                <Card.Title>View Results</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      as="select"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="">Select Unit</option>
                      <option value={1}>Unit 1</option>
                      <option value={2}>Unit 2</option>
                      <option value={3}>Unit 3</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
                <br />

                <Table bordered hover striped>
                  <thead>
                    <tr>
                      <th>Sno</th>
                      <th>Subject</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length > 0 ? (
                      results.map((res, index) => (
                        <>
                          <tr key={res.id}>
                            <td>{index + 1}</td>
                            <td>{res.subject_name}</td>
                            <td>{res.exam}</td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          No results found
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={5}>
                        <br/>
                        Unit {unit} Percentage : <b>{percentage}%</b>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
};

export default ViewResult;
