import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Fab } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from "@mui/icons-material/Delete";

const SpecDetails = () => {
  const { id } = useParams();
  const [specDetails, setSpecDetails] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    const fetchData = async () => {
      try {
        const specResponse = await axios.get(
          `http://localhost:3000/specifications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSpecDetails(specResponse.data);

        const categoryResponse = await axios.get(
          "http://localhost:3000/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async (id) => {
    console.log(id);
  };

  if (!specDetails) {
    return <Typography>Loading...</Typography>;
  }

  // Format createdBy and updatedBy fields
  const createdBy = `${specDetails.createdBy.firstName} ${specDetails.createdBy.lastName}`;
  const updatedBy = `${specDetails.updatedBy.firstName} ${specDetails.updatedBy.lastName}`;

  // Create rows array with data for each specification
  const rows = specDetails.specifications.map((spec, index) => ({
    id: index + 1,
    _id: specDetails._id,
    "directorate.name": specDetails.directorate.name,
    "specifications.category.categoryName": spec.category.categoryName,
    "specifications.description": spec.description,
    createdBy: createdBy,
    createdAt: new Date(specDetails.createdAt).toLocaleString(),
    updatedBy: updatedBy,
    updatedAt: new Date(specDetails.updatedAt).toLocaleString(),
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "directorate.name", headerName: "Directorate", width: 200 },
    {
      field: "specifications.category.categoryName",
      headerName: "Category",
      width: 150,
    },
    {
      field: "specifications.description",
      headerName: "Description",
      width: 300,
    },
    { field: "createdBy", headerName: "Created By", width: 200 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "updatedBy", headerName: "Updated By", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Fab
            size="small"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon />
          </Fab>
        </>
      ),
    },
  ];

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography component="h1" variant="h5">
              Specification Details for {specDetails.uniqueNumber}
            </Typography>
            <Fab size="small" color="default">
              <PrintIcon />
            </Fab>
          </Box>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={specDetails.specifications.length} // Set pageSize to show all specifications
              rowsPerPageOptions={[specDetails.specifications.length]}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default SpecDetails;
