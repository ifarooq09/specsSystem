import { useState } from "react";
import Sidebar from "../layout/Sidebar";
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const Reports = () => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [group, setGroup] = useState("");
  const [subGroup, setSubGroup] = useState([]);
  const [selectedSubGroup, setSelectedSubGroup] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGroupChange = async (event) => {
    const selectedGroup = event.target.value;
    setGroup(selectedGroup);

    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    let url = "http://localhost:3000/";
    if (selectedGroup === "all") {
      url += "specifications";
    } else {
      url += selectedGroup;
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error fetching sub-groups: ${res.statusText}`);
      }

      const data = await res.json();
      let formattedData = [];

      if (selectedGroup === "all") {
        formattedData = [{ value: "all", display: "All" }];
      } else if (selectedGroup === "users") {
        formattedData = data.map((user) => ({
          value: user._id,
          display: `${user.firstName} ${user.lastName}`,
        }));
      } else if (selectedGroup === "directorates") {
        formattedData = data.map((directorate) => ({
          value: directorate._id,
          display: directorate.name,
        }));
      } else if (selectedGroup === "categories") {
        formattedData = data.map((category) => ({
          value: category._id,
          display: category.categoryName,
        }));
      }

      setSubGroup(formattedData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubGroupChange = (event) => {
    setSelectedSubGroup(event.target.value);
  };

  const columns = [
    { field: "uniqueNumber", headerName: "Form Number", width: 150 },
    { field: "directorate", headerName: "Directorate", width: 200 },
    { field: "category", headerName: "Category", width: 200 },
    { field: "description", headerName: "Description", width: 500 },
    { field: "warranty", headerName: "Warranty", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "updatedAt", headerName: "Updated At", width: 180 },
  ];

  const generateReport = async (event) => {
    event.preventDefault();

    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");

    let url = "http://localhost:3000/";
    if (group === "all") {
      url += "specifications";
    } else if (group === "users") {
      url += `${group}/${selectedSubGroup}/report?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    } else {
      url += `${group}/${selectedSubGroup}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error fetching report: ${res.statusText}`);
      }

      const data = await res.json();

      if (data && data.userReport) {
        const formattedData = data.userReport.flatMap((item) => {
          return item.specifications.map((spec, index) => {
            // Format the description for each specification
            const formattedDescription = spec.description
              .split("-")
              .join("\n• ");

            return {
              id: `${item._id}-${index}`,
              uniqueNumber: item.uniqueNumber,
              directorate: item.directorate.name,
              category: spec.category.categoryName,
              description: formattedDescription, // Use the reformatted description
              warranty: spec.warranty,
              createdAt: new Date(item.createdAt).toLocaleString(),
              updatedAt: new Date(item.updatedAt).toLocaleString(),
            };
          });
        });
        setReportData(formattedData);
      } else if (data && data.directorateReport) {
        // Destructure directorateReport from data
        const { name, specifications } = data.directorateReport;

        // Format the data
        const formattedData = specifications.flatMap((specification) => {
          return specification.specifications.map((spec, index) => {
            // Format the description for each specification
            const formattedDescription = spec.description
              .split("-")
              .join("\n• ");

            return {
              id: `${specification._id}-${index}`,
              uniqueNumber: specification.uniqueNumber,
              directorate: name, // Use the directorate name from the top level
              category: spec.category.categoryName, // Use the category name from the specification
              description: formattedDescription, // Use the reformatted description
              warranty: spec.warranty,
              createdAt: new Date(specification.createdAt).toLocaleString(),
              updatedAt: new Date(specification.updatedAt).toLocaleString(),
            };
          });
        });

        setReportData(formattedData);
      } else if (data && data.categoryReport) {
        // Destructure categoryReport from data
        const { categoryReport } = data;

        // Format the data
        const formattedData = categoryReport.flatMap((report) => {
          return report.specifications.map((spec, index) => {
            // Format the description for each specification
            const formattedDescription = spec.description
              .split("-")
              .join("\n• ");

            return {
              id: `${report._id}-${index}`,
              uniqueNumber: report.uniqueNumber,
              directorate: report.directorate.name, // Use the directorate name from the report
              category: spec.category.categoryName, // Use the category name from the specification
              description: formattedDescription, // Use the reformatted description
              warranty: spec.warranty,
              createdAt: new Date(report.createdAt).toLocaleString(),
              updatedAt: new Date(report.updatedAt).toLocaleString(),
            };
          });
        });

        setReportData(formattedData);
      } else if (data && data.specReport) {
        const { specReport } = data;

        // Format the data
        const formattedData = specReport.flatMap((report) => {
          return report.specifications.map((spec, index) => {
            // Format the description for each specification
            const formattedDescription = spec.description
              .split("-")
              .join("\n• ");

            return {
              id: `${report._id}-${index}`,
              uniqueNumber: report.uniqueNumber,
              directorate: report.directorate.name, // Use the directorate name from the report
              category: spec.category.categoryName, // Use the category name from the specification
              description: formattedDescription, // Use the reformatted description
              warranty: spec.warranty,
              createdAt: new Date(report.createdAt).toLocaleString(),
              updatedAt: new Date(report.updatedAt).toLocaleString(),
            };
          });
        });

        setReportData(formattedData);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStartDate(dayjs());
    setEndDate(dayjs());
    setGroup("");
    setSubGroup([]);
    setSelectedSubGroup("");
    setReportData([]);
  };

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
              onSubmit={generateReport}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label-group">Select</InputLabel>
                    <Select
                      labelId="role-label"
                      id="group"
                      name="group"
                      value={group}
                      label="Group"
                      onChange={handleGroupChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="users">Users</MenuItem>
                      <MenuItem value="directorates">Directorates</MenuItem>
                      <MenuItem value="categories">Categories</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label-subgroup">Select</InputLabel>
                    <Select
                      labelId="role-label-subgroup"
                      id="subgroup"
                      name="subgroup"
                      value={selectedSubGroup}
                      label="Sub-Group"
                      onChange={handleSubGroupChange}
                    >
                      {subGroup.map((sub, index) => (
                        <MenuItem key={index} value={sub.value}>
                          {sub.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
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
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2, ml: 2, backgroundColor: "red" }}
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
            {reportData.length > 0 && (
              <Box sx={{ height: 800, width: "100%", mt: 3 }}>
                <DataGrid
                  rows={reportData}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  loading={loading}
                  slots={{
                    toolbar: () => {
                      return (
                        <GridToolbarContainer
                          sx={{
                            justifyContent: "flex-end",
                          }}
                        >
                          <GridToolbarExport
                            csvOptions={{
                              fileName: "Report",
                              utf8WithBom: true,
                            }}
                          />
                        </GridToolbarContainer>
                      );
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Reports;
