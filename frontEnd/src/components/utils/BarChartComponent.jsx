import { Bar } from 'react-chartjs-2';
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartComponent = () => {
  const [maxCategories, setMaxCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("usersdatatoken");

    if (!token) {
      setErrorMessage("No user token found.");
      setIsLoading(false);
      return;
    }

    const fetchSpecForms = async () => {
      try {
        const res = await fetch("http://localhost:3000/specifications", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 403) {
            setErrorMessage("You do not have permission to view this content.");
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
        } else {
          const data = await res.json();

          // Process the response to get the category counts
          const categoryCounts = data.specReport.reduce((acc, report) => {
            report.specifications.forEach((spec) => {
              const categoryName = spec.category.categoryName;
              acc[categoryName] = (acc[categoryName] || 0) + 1;
            });
            return acc;
          }, {});

          // Get the top 5 categories
          const sortedCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

          setMaxCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setErrorMessage("An error occurred while fetching forms.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecForms(); // Call the function once within useEffect
  }, []);

  const chartData = {
    labels: maxCategories.map(cat => cat.name),
    datasets: [
      {
        label: 'Devices Name',
        data: maxCategories.map(cat => cat.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 5 Categories',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          autoSkip: true, // Automatically skip some ticks based on chart size
          callback: function(value) {
            // Display only whole numbers
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
      },
    },
  };
  

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {isLoading ? (
        <>
          <Skeleton variant="text" width={120} height={40} />
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="text" width={50} height={30} />
        </>
      ) : errorMessage ? (
        <p style={{
          color: "red",
          fontSize: "18px",
          fontWeight: "bold",
        }}>
          {errorMessage}
        </p>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#f0f4f8",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "auto"
        }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default BarChartComponent;
