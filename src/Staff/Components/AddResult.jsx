import React, { useState, useEffect, useMemo } from "react";
import Titile from "../../Home/Components/Titile";
import StaffSideNav from "./StaffSideBar";
import { Form, Card, Button, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddResult = () => {
  // 🔹 States
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [cos, setCos] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [coMarks, setCoMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [fetchStudents, setFetchStudents] = useState(false);

  // 🔹 Memoized email
  const email = useMemo(() => {
    const stored = localStorage.getItem("email");
    return stored ? JSON.parse(stored).replace(/^"|"$/g, "") : "";
  }, []);

  // 🔹 Fetch all sessions
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/addsession/");
        setSessions(res.data);
      } catch (error) {
        toast.error("Error fetching sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // 🔹 Fetch subjects based on session
  useEffect(() => {
    if (!session) return;
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/addsub/?session=${session}&email=${email}`
        );
        setSubjects(res.data);
      } catch (error) {
        toast.error("Error fetching subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [session, email]);

  // 🔹 Fetch units based on subject
  useEffect(() => {
    if (!subject) return;
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/addunit/?subject=${subject}`
        );
        setUnits(res.data || []);
      } catch (error) {
        toast.error("Error fetching units");
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [subject]);

  // 🔹 Fetch COs based on unit
  useEffect(() => {
    if (!unit) return;
    const fetchCos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/fetchco/?unit=${unit}`
        );
        setCos(res.data);
      } catch (error) {
        toast.error("Error fetching COs");
      } finally {
        setLoading(false);
      }
    };
    fetchCos();
  }, [unit]);

  // 🔹 Fetch results (to check if already uploaded)
  useEffect(() => {
    if (!session || !subject || !unit) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/result_stu/?email=${email}&session=${session}&unit=${unit}&subject=${subject}`
        );
        setResults(res.data);
        if (res.data.length > 0) {
          toast.info("Results already uploaded");
        }
      } catch (error) {
        toast.error("Error fetching results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [session, subject, unit]);

  // 🔹 Fetch students (triggered manually)
  useEffect(() => {
    if (!fetchStudents) return;
    const fetchStudentList = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/stu_fetch/?email=${email}&session=${session}`
        );
        setStudents(res.data);
      } catch (error) {
        toast.error("Error fetching students");
      } finally {
        setLoading(false);
        setFetchStudents(false); // ✅ Stop loop
      }
    };
    fetchStudentList();
  }, [fetchStudents, email, session]);

  // 🔹 Handle CO marks input
  const handleCoMarksChange = (studentId, coId, max, value) => {
    const numericValue = Number(value);
    if (numericValue < 0) return;
    if (numericValue > max) {
      toast.error(`Marks must be ≤ ${max}`);
      return;
    }

    setCoMarks((prevMarks) => {
      const updated = {
        ...prevMarks,
        [studentId]: {
          ...(prevMarks[studentId] || {}),
          [coId]: numericValue,
        },
      };

      const total = Object.values(updated[studentId] || {}).reduce(
        (sum, mark) => sum + (mark || 0),
        0
      );
      if (total > 40) {
        toast.error("Total marks cannot exceed 40!");
        return prevMarks;
      }
      return updated;
    });
  };

  // 🔹 Submit results
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      for (const student of students) {
        const studentCoMarks = coMarks[student.id] || {};
        const totalMarks = Object.values(studentCoMarks).reduce(
          (sum, mark) => sum + (mark || 0),
          0
        );
        await axios.post("http://localhost:8000/api/add-student-result/", {
          student: student.id,
          subject,
          unit,
          coMarks: studentCoMarks,
          exam:totalMarks
        });
      }
      toast.success("Results added successfully");
    } catch (error) {
      toast.error("Error adding results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Titile />
      <div className="d-lg-flex d-md-block d-sm-block">
        <StaffSideNav />
        <div className="dash flex-grow-1 p-3">
          <div className="dash-container d-flex justify-content-center">
            <Card
              className="animate__animated animate__fadeIn mt-2"
              style={{ width: "100%" }}
            >
              <Card.Header>
                <Card.Title>Add Student Result</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Select Session:</Form.Label>
                    <Form.Select
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      required
                    >
                      <option value="">-- Select Session Year --</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.year}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Select Subject:</Form.Label>
                    <Form.Select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    >
                      <option value="">-- Select Subject --</option>
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Select Unit Format:</Form.Label>
                    <Form.Select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      required
                    >
                      <option value="">-- Select Unit Format --</option>
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.unit_field}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <br />
                  <Form.Group className="d-flex justify-content-center">
                    <Button
                      className="px-5 py-2"
                      type="button"
                      onClick={() => setFetchStudents(true)}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Fetch Students"
                      )}
                    </Button>
                  </Form.Group>

                  <br />

                  {students.length > 0 && results.length <= 0 && (
                    <>
                      <Table bordered striped responsive>
                        <thead>
                          <tr>
                            <th>Sno</th>
                            <th>Student</th>
                            {cos.map((co) => (
                              <th key={co.id}>
                                {co.co_number} ({co.max_marks})
                              </th>
                            ))}
                            <th>Total Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, index) => (
                            <tr key={student.id}>
                              <td>{index + 1}</td>
                              <td>{student.pin}</td>
                              {cos.map((co) => (
                                <td key={co.co_number}>
                                  <Form.Control
                                    type="number"
                                    value={
                                      coMarks[student.id]?.[co.co_number] || ""
                                    }
                                    onChange={(e) =>
                                      handleCoMarksChange(
                                        student.id,
                                        co.co_number,
                                        co.max_marks,
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </td>
                              ))}
                              <td>
                                {Object.values(
                                  coMarks[student.id] || {}
                                ).reduce((sum, mark) => sum + (mark || 0), 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      <Form.Group className="d-flex justify-content-center">
                        <div className="btnn">
                          <Button className="bttn" type="submit" disabled={loading}>
                            {loading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Add Result"
                            )}
                          </Button>
                        </div>
                      </Form.Group>
                    </>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddResult;
