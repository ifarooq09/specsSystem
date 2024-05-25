import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";

const SpecDetails = () => {
  const { id } = useParams();
  const [specDetails, setSpecDetails] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/specifications/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setSpecDetails(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!specDetails) {
    return <Typography>Loading...</Typography>;
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
  ];

  const rows = specDetails.specifications.map((spec, index) => ({
    id: index + 1,
    category: spec.categoryName,
    description: spec.description,
  }));

  return (
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
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Specification Details for {specDetails.uniqueNumber}
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      </Box>
    </Box>
  );
};

export default SpecDetails;
