import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


const AllDirectorates = () => {
  const navigate = useNavigate();

  const [directorates, setDirectorates] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/directorates", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setDirectorates(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Directorate Name', flex: 1 },
    { field: 'user', headerName: "Created By", flex: 1}
  ];

  // Ensure users is not undefined or null before mapping over it
  const rows = directorates ? directorates.map((directorate, index) => ({
    id: index + 1,
    name: directorate.name,
    user: `${directorate?.user?.firstName} ${directorate?.user?.lastName}`
  })) : [];

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          p: 3,
          marginTop: "55px",
          height: "100vh",
        }}
      >
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "auto",
          }}
        >
          <Typography component="h1" variant="h5">
            All Directorates
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{
              width: "15%",
              p: 1,
              mt: 2,
            }}
            onClick={() => navigate("addDirectorate")}
          >
            Add Directorate
          </Button>
          <div style={{ height: 400, width: '100%', marginTop: 20 }}>
            <DataGrid
              columns={columns}
              rows={rows}
            />
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default AllDirectorates;
