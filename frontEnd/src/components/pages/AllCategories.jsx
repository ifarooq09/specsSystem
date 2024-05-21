import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Paper, Typography, Fab } from "@mui/material";
import { Button } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/categories", {
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
        setCategories(data);
      } catch (error) {
        console.error("Error fetching Categories:", error.message);
      }
    }; 

    fetchCategories(); 
  }, []);

  const handleUpdate = async (id, newName) => {
    let token = localStorage.getItem("usersdatatoken");
    try {
      const res = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ categoryName: newName }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { updatedCategory } = await res.json();

      // Update categories state with the updated category
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      );
    } catch (error) {
      console.error("Error updating category:", error.message);
    }
  };

  const handleDelete = async (id) => {
    let token = localStorage.getItem("usersdatatoken");
    try {
      const res = await fetch(`http://localhost:3000/categories/${id}`, {
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

      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleCellEditCommit = async (params) => {
    const { id, field, value } = params;
    if (field === "categoryName") {
      handleUpdate(id, value);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "categoryName",
      headerName: "Category Name",
      flex: 1,
      editable: true,
    },
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
            onClick={() =>
              handleUpdate(params.row._id, params.row.categoryName)
            }
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

  const rows = categories
    ? categories.map((category, index) => ({
        id: index + 1,
        _id: category._id,
        categoryName: category.categoryName,
        createdBy: `${category?.createdBy?.firstName} ${category?.createdBy?.lastName}`,
        createdAt: new Date(category.createdAt).toLocaleString(),
        updatedBy: `${category?.updatedBy?.firstName} ${category?.updatedBy?.lastName}`,
        updatedAt: new Date(category.updatedAt).toLocaleString(),
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
            All Categories
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{
              width: "15%",
              p: 1,
              mt: 2,
            }}
            onClick={() => navigate("addCategory")}
          >
            Add Category
          </Button>
          <div style={{ height: 600, width: "100%", marginTop: 20 }}>
            <DataGrid
              columns={columns}
              rows={rows}
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

export default AllCategories;
