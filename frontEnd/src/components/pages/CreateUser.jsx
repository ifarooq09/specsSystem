import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const setVal = (event) => {
    const { name, value } = event.target;
    setInputVal((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));
  };

  const handleRoleChange = (event) => {
    setInputVal((prevVal) => ({
      ...prevVal,
      role: event.target.value,
    }));
  };

  const addUserData = async (event) => {
    event.preventDefault();

    const { firstName, lastName, email, password, role } = inputVal;

    if (firstName === "") {
      alert("Enter your First Name");
    } else if (lastName === "") {
      alert("Enter your Last Name");
    } else if (email === "") {
      alert("Enter your Email Address");
    } else if (!email.includes("@")) {
      alert("Enter a valid Email");
    } else if (password === "") {
      alert("Enter a password");
    } else if (password.length < 8) {
      alert("Password must be at least 8 characters");
    } else if (role === "") {
      alert("Select a role");
    } else {
      let token = localStorage.getItem("usersdatatoken");

      if (!token) {
        alert("No user token found");
        return;
      }
      const data = await fetch("http://localhost:3000/users/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });

      await data.json();
    }

    setInputVal({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });

    navigate("/users")
  };

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
              Create New User
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={addUserData}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    value={inputVal.firstName}
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={setVal}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={inputVal.lastName}
                    autoComplete="family-name"
                    onChange={setVal}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={inputVal.email}
                    autoComplete="email"
                    onChange={setVal}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    value={inputVal.password}
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={setVal}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={inputVal.role}
                      label="Role"
                      onChange={handleRoleChange}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create
              </Button>
            </Box>
          </Paper>
        </Box>
    </>
  );
}
