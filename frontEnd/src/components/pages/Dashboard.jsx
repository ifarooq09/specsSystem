import Sidebar from "../layout/Sidebar";
import {
  Box,
  Toolbar,
  Container,
  Grid,
  Paper,
  Typography,
  Link,
} from "@mui/material";
import BarChartComponent from "../utils/BarChartComponent"
import PiChartComponent from "../utils/PiChartComponent"
import TotalUsers from "../utils/TotalUsers";
import TotalDirectorates from "../utils/TotalDirectorates";
import TotalCategories from "../utils/TotalCategories";
import TotalSpecForms from "../utils/TotalSpecForms";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.mail.gov.af">
        IT Directorate - Ministry of Agriculture, Irrigation and Livestock
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Dashboard = () => {
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
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={3}>
                <Paper>
                  <TotalUsers />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper>
                  <TotalDirectorates />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper>
                  <TotalCategories />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper>
                  <TotalSpecForms />
                </Paper>
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper>
                  <BarChartComponent />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper>
                  <PiChartComponent />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </>
  );
};


export default Dashboard;
