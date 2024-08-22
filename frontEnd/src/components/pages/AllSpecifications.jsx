import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Paper,
  Fab,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const AllSpecifications = () => {
  const navigate = useNavigate();
  const [specifications, setSpecifications] = useState([]);
  const [filteredSpecifications, setFilteredSpecifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [userRole, setUserRole] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/specifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API Response:", response.data); // Log the response
        setSpecifications(response.data.specReport || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching specifications:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("User role fetched:", data.role); // Log the fetched role
        setUserRole(data.role); // Save the user's role
      } catch (error) {
        console.error("Error fetching user role:", error.message);
      }
    };

    fetchData();
    fetchUserRole();
  }, []);

  useEffect(() => {
    // Filter specifications whenever the search query or specifications change
    const filteredData = specifications.filter((spec) =>
      spec.uniqueNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSpecifications(filteredData);
    setPage(1); // Reset to the first page when search query changes
  }, [searchQuery, specifications]);

  const handleCardClick = (id) => {
    navigate(`/specifications/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/specifications/addSpecification/${id}`);
  };

  const handleDelete = async (id) => {
    if (userRole !== "admin") {
      alert("You do not have permission to delete specifications.");
      return;
    }

    let token = localStorage.getItem("usersdatatoken");
    try {
      const res = await fetch(`http://localhost:3000/specifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Fetch the latest data after deletion
      const response = await axios.get("http://localhost:3000/specifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSpecifications(response.data.specReport || []);
    } catch (error) {
      console.error("Error deleting specification:", error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
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
          minHeight: "100vh",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography component="h1" variant="h5">
              All Specifications
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search Specifications"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="success"
            sx={{
              width: "15%",
              p: 1,
              mt: 2,
            }}
            onClick={() => navigate("addSpecification")}
          >
            Add Specification
          </Button>
        </Paper>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {Array.isArray(filteredSpecifications) &&
            filteredSpecifications
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((spec) => (
                <Grid item key={spec._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      sx={{ flexGrow: 1 }}
                      onClick={() => handleCardClick(spec._id)}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={`http://localhost:3000/${spec.document}`}
                        alt="Document Thumbnail"
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography gutterBottom variant="h5" component="div">
                          {spec.uniqueNumber}
                        </Typography>
                        <div>
                          <Fab
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(spec._id);
                            }}
                          >
                            <EditIcon />
                          </Fab>
                          <Fab
                            size="small"
                            color="secondary"
                            sx={{ ml: 2 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(spec._id);
                            }}
                          >
                            <DeleteIcon />
                          </Fab>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
        </Grid>
        <Pagination
          count={Math.ceil(filteredSpecifications.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
        />
      </Box>
    </>
  );
};

export default AllSpecifications;
