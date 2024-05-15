import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const AddDirectorate = () => {
  const [directorateName, setDirectorateName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (directorateName === "") {
      alert("Enter the Directorate Name");
    } else {
      let token = localStorage.getItem("usersdatatoken");

      if (!token) {
        alert("No user token found");
        return;
      }

      const res = await fetch("http://localhost:3000/directorates/addDirectorate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ name: directorateName }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        console.log("error", data.error || data);
        alert(data.error || "An error occurred");
      } else {
        navigate("/directorates");
      }
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
          Add New Directorate
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="text"
            label="Directorate Name"
            name="directorateName"
            autoComplete="text"
            autoFocus
            value={directorateName}
            onChange={(e) => setDirectorateName(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            color="success"
            sx={{
              width: "15%",
              p: 1,
              mt: 2
            }}
          >
            Add
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddDirectorate;
