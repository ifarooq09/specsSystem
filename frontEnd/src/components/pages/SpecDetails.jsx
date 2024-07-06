/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from "react";
import { Box, Typography, Paper, Fab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { useReactToPrint } from "react-to-print";
import PrintLayout from "../layout/PrintLayout";

const SpecDetails = () => {
  const { id } = useParams();
  const [specDetails, setSpecDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const printRef = useRef();

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

  const handleDelete = async (itemId) => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/specifications/${id}/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSpecDetails((prevDetails) => ({
        ...prevDetails,
        specifications: prevDetails.specifications.filter(
          (spec) => spec._id !== itemId
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrintAction = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint = async () => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

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
      handlePrintAction();
    } catch (error) {
      console.error(error);
    }
  };

  if (!specDetails) {
    return <Typography>Loading...</Typography>;
  }

  const createdBy = `${specDetails.createdBy.firstName} ${specDetails.createdBy.lastName}`;
  const updatedBy = `${specDetails.updatedBy.firstName} ${specDetails.updatedBy.lastName}`;

  const rows = specDetails.specifications.map((spec, index) => {
    const formattedDescription = spec.description.split("-").join("\n-");
    return {
      id: index + 1,
      _id: spec._id,
      "directorate.name": specDetails.directorate.name,
      "specifications.category.categoryName": spec.category.categoryName,
      "specifications.description": formattedDescription,
      createdBy: createdBy,
      createdAt: new Date(specDetails.createdAt).toLocaleString(),
      updatedBy: updatedBy,
      updatedAt: new Date(specDetails.updatedAt).toLocaleString(),
    };
  });

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
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
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            marginBottom: "8px",
            marginTop: "2px",
            textAlign: "left"
          }}
        >
          {params.value}
        </div>
      ),
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
            <Fab size="small" color="default" onClick={handlePrint}>
              <PrintIcon />
            </Fab>
          </Box>
          <Box sx={{ height: 700, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={specDetails.specifications.length}
              rowsPerPageOptions={[specDetails.specifications.length]}
              getRowHeight={() => "auto"}
              getEstimatedRowHeight={() => 200}
              sx={{
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                  textAlign: "center",
                  whiteSpace: "pre-wrap",
                },
                "& .MuiDataGrid-columnHeader": {
                  textAlign: "center",
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <PrintLayout specDetails={specDetails} />
        </div>
      </div>
    </>
  );
};

export default SpecDetails;
