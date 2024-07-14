import Sidebar from "../layout/Sidebar";
import { Box, Paper, Typography } from "@mui/material";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useState } from "react";

const Reports = () => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

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
              Generate Reports
            </Typography>
            <Box
              component="form"
              noValidate
              //   onSubmit={}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label">Select</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      //   value={}
                      label="Role"
                      //   onChange={}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                Generate
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Reports;
