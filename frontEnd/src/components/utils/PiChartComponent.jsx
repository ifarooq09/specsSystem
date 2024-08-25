import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PiChartComponent = () => {
  const [chartData, setChartData] = useState(null);
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
          const directorateCounts = {};

          // Count occurrences of each directorate
          data.specReport.forEach(spec => {
            const directorateName = spec.directorate.name;
            if (directorateCounts[directorateName]) {
              directorateCounts[directorateName]++;
            } else {
              directorateCounts[directorateName] = 1;
            }
          });

          // Convert to array and sort to get top 5
          const sortedDirectorates = Object.entries(directorateCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          // Prepare data for Pie chart
          const labels = sortedDirectorates.map(item => item[0]);
          const counts = sortedDirectorates.map(item => item[1]);
          // eslint-disable-next-line no-unused-vars
          const totalCounts = counts.reduce((a, b) => a + b, 0);

          setChartData({
            labels,
            datasets: [{
              label: 'Top Directorates',
              data: counts,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
              ]
            }]
          });
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
          alignItems: "flex-start",
          backgroundColor: "#f0f4f8",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <p style={{
            fontWeight: "bold",
            fontSize: "22px",
            color: "#333"
          }}>
            Top Directorates
          </p>
          {chartData && (
            <Pie
              data={chartData}
              options={{
                plugins: {
                  datalabels: {
                    color: '#fff',
                    align: 'start',
                    anchor: 'end',
                    font: {
                      weight: 'bold',
                      size: 12
                    }
                  },
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 20,
                      padding: 15,
                    }
                  }
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PiChartComponent;
