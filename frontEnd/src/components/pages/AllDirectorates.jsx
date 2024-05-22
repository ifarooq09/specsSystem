import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Paper, Typography, Fab } from "@mui/material";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  gridClasses,
} from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const AllDirectorates = () => {
  const navigate = useNavigate();
  const [directorates, setDirectorates] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    const fetchDirectorates = async () => {
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
        console.error("Error fetching directorates:", error.message);
      }
    };

    fetchDirectorates();
  }, []);

  const handleUpdate = async (id, newName) => {
    let token = localStorage.getItem("usersdatatoken");
    try {
      const res = await fetch(`http://localhost:3000/directorates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { updatedDirectorate } = await res.json();

      // Update directorates state with the updated directorate
      setDirectorates((prevDirectorates) =>
        prevDirectorates.map((dir) =>
          dir._id === updatedDirectorate._id ? updatedDirectorate : dir
        )
      );
    } catch (error) {
      console.error("Error updating directorate:", error.message);
    }
  };

  const handleDelete = async (id) => {
    let token = localStorage.getItem("usersdatatoken");
    try {
      const res = await fetch(`http://localhost:3000/directorates/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setDirectorates((prev) => prev.filter((dir) => dir._id !== id));
    } catch (error) {
      console.error("Error deleting directorate:", error.message);
    }
  };

  const handleCellEditCommit = async (params) => {
    const { id, field, value } = params;
    if (field === "name") {
      handleUpdate(id, value);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Directorate Name", flex: 1, editable: true },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    { field: "updatedBy", headerName: "Updated By", flex: 1 },
    { field: "updatedAt", headerName: "Updated At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Fab
            size="small"
            color="primary"
            onClick={() => handleUpdate(params.row._id, params.row.name)}
          >
            <EditIcon />
          </Fab>
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

  const rows = directorates
    ? directorates.map((directorate, index) => ({
        id: index + 1, // Use the actual _id from the database
        _id: directorate._id,
        name: directorate.name,
        createdBy: `${directorate?.createdBy?.firstName} ${directorate?.createdBy?.lastName}`,
        createdAt: new Date(directorate.createdAt).toLocaleString(),
        updatedBy: `${directorate?.updatedBy?.firstName} ${directorate?.updatedBy?.lastName}`,
        updatedAt: new Date(directorate.updatedAt).toLocaleString(),
      }))
    : [];

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
          <div style={{ height: 600, width: "100%", marginTop: 20 }}>
            <DataGrid
              columns={columns}
              rows={rows}
              slots={{
                toolbar: () => {
                  return (
                    <GridToolbarContainer sx={{
                      justifyContent: 'flex-end'
                    }}>
                      <GridToolbarExport 
                        csvOptions={{
                          fileName: 'directorates',
                          utf8WithBom: true,
                        }}
                      />
                    </GridToolbarContainer>
                  );
                },
              }}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? grey[200] : grey[700],
                },
              }}
              onCellEditCommit={handleCellEditCommit}
            />
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default AllDirectorates;
