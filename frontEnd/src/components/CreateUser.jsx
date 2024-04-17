import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
    },
  },
});

export default function SignUp() {
  const [inputVal, setInputVal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // console.log(inputVal)

  const setVal = (event) => {
    const { name, value } = event.target;

    setInputVal(() => {
      return {
        ...inputVal,
        [name]: value,
      };
    });
  };

  const addUserData = async (event) => {
    event.preventDefault();

    const { firstName, lastName, email, password } = inputVal;

    if (firstName === "") {
      alert("Enter your First Name");
    } else if (lastName === "") {
      alert("Enter your Last Name");
    } else if (email === "") {
      alert("Enter your Email Address");
    } else if (!email.includes("@")) {
      alert("Enter valid Email");
    } else if (password === "") {
      alert("Enter password");
    } else if (password.length < 8) {
      alert("Password must be of atleast 8 characters");
    } else {
      // console.log("User registration successfully done");

      const data = await fetch("http://localhost:3000/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName, lastName, email, password
        })
      })

      const res = await data.json();
      console.log(res)
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}