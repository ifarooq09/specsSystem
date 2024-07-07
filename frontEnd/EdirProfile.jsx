/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, TextField, Paper } from "@mui/material";

const EditProfile = ({ loginData, setEditMode, setLoginData }) => {
  const [formData, setFormData] = useState({
    firstName: loginData.validUserOne.firstName,
    lastName: loginData.validUserOne.lastName,
    email: loginData.validUserOne.email,
    password: loginData.validUserOne.password,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("usersdatatoken");

    const res = await fetch("http://localhost:3000/editProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.status === 200) {
      setLoginData((prev) => ({
        ...prev,
        validUserOne: {
          ...prev.validUserOne,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
      }));
      setEditMode(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "auto",
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </form>
      <Button variant="outlined" color="secondary" sx={{ mt: 2 }} onClick={() => setEditMode(false)}>
        Cancel
      </Button>
    </Paper>
  );
};

export default EditProfile;
