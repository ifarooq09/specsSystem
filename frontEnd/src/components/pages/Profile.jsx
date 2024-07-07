import { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import { Box, Toolbar, Typography, Paper, Avatar, Button, Grid } from "@mui/material";
import EditProfile from "../../../EdirProfile";

const Profile = () => {
  const [loginData, setLoginData] = useState({});
  const [editMode, setEditMode] = useState(false);

  const userValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("http://localhost:3000/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      history("*");
    } else {
      setLoginData(data);
    }
  };

  useEffect(() => {
    userValid();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            p: 3,
            marginTop: "10px",
            height: "100vh",
          }}
        >
          <Toolbar />
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "auto",
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                backgroundColor: "#2e7d32",
                fontWeight: "bold",
                fontSize: "56px",
                color: "#ffffff",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              {loginData?.validUserOne?.firstName?.charAt(0).toUpperCase() +
                "" +
                loginData?.validUserOne?.lastName?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ width: "100%", mt: 3 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">First Name:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{loginData?.validUserOne?.firstName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">Last Name:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{loginData?.validUserOne?.lastName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">Email:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{loginData?.validUserOne?.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">Role:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{loginData?.validUserOne?.role}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">Status:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {loginData?.validUserOne?.active ? "Active" : "Not Active"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          </Paper>
          {editMode && (
            <EditProfile
              loginData={loginData}
              setEditMode={setEditMode}
              setLoginData={setLoginData}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Profile;
