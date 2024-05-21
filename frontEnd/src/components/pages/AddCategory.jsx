import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryName === "") {
      alert("Enter the Category Name");
      return;
    }

    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/categories/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ categoryName: categoryName }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Error response:", data);
        alert(data.error || "An error occurred");
      } else {
        navigate("/categories");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while submitting the form. Please try again later."
      );
    }
  };

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
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "auto",
        }}
      >
        <Typography component="h1" variant="h5">
          Add New Category
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="categoryName"
            label="Category Name"
            name="categoryName"
            autoComplete="text"
            autoFocus
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <Button
            variant="contained"
            type="submit"
            color="success"
            sx={{
              width: "15%",
              p: 1,
              mt: 2,
            }}
          >
            Add
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddCategory;
