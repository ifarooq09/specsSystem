import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.mail.gov.af">
        IT Directorate - Ministry of Agriculture, Irrigation and Livestock
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: "#2e7d32",
        },
    },
});

export default function SignIn() {

  const [loginVal, setLoginVal] = useState({
    email: "",
    password: ""
  })

  const loginValue = (event) => {
    const {name, value} = event.target;

    setLoginVal(() =>{
      return {
        ...loginVal,
        [name]: value
      }
    })
  }

  const loginUser = async (event) => {
    event.preventDefault();
    
    const {email, password} = loginVal;

   if (email === "") {
      alert("Enter your Email Address");
    } else if (!email.includes("@")) {
      alert("Enter valid Email");
    } else if (password === "") {
      alert("Enter password");
    } else if (password.length < 8) {
      alert("Password must be of atleast 8 characters");
    } else {
      // console.log("Loged Successfully");

      const data = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      await data.json();
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ backgroundColor: '#f2f3f4', borderRadius: 3, border: '2px solid green', marginTop: 10, marginBottom: 5}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            alt="Ministry of Agriculture, Irrigation and Livestock"
            src="/MAILLogoTransparent.png"
            sx={{ width: 180, height: 180, marginBottom: 2}}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={loginVal.email}
              autoComplete="email"
              autoFocus
              onChange={loginValue}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={loginVal.password}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={loginValue}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}