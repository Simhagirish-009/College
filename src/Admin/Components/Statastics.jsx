import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement
);

const Statastics = () => {
  const [count, setCount] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/count/");
      setCount(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Guard against undefined data
  const sessions = count.bar_stu?.sessions || [];
  const stuCounts = count.bar_stu?.stu_counts || [];

  const barStudent = {
    labels: sessions,
    datasets: [
      {
        label: "Student Count per Session",
        data: stuCounts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
        barThickness: 100,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };
  const pieStaff = {
    labels: count.pie_staff?.courses || ["No Data"],
    datasets: [
      {
        label: "Staff Distribution",
        data: count.pie_staff?.staff_counts || [0],
        borderWidth: 1,
      },
    ],
  };

  const pieStudent = {
    labels: count.pie_stu?.courses || ["No Data"],
    datasets: [
      {
        label: "Student Distribution",
        data: count.pie_stu?.stu_counts || [0],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <p>Loading charts...</p>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <Card style={{ width: "98%", marginTop: "10px" }}>
            <Card.Body>
              <br />
              <h3>Staff and Students data by course</h3>

              <div className="d-flex justify-content-around">
                <div className="mt-5 text-center" style={{ width: "28%" }}>
                  <Pie data={pieStaff} />
                  <h4>Staff Members of the Courses</h4>
                </div>
                <div className="mt-5 text-center" style={{ width: "28%" }}>
                  <Pie data={pieStudent} />
                  <h4>Students of the Courses</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card style={{ width: "98%", marginTop: "10px" }}>
            <Card.Body>
              <div>
                <div className="chart-container mt-4" style={{ width: "75%" }}>
                  <h3>Students Data by Sessions</h3>
                  <Bar data={barStudent} options={barOptions} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Statastics;
