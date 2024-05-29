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
        setSpecifications(response.data);
        setFilteredSpecifications(response.data); // Set initial filtered data
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/specifications/${id}`);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filteredData = specifications.filter((spec) =>
      spec.uniqueNumber.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredSpecifications(filteredData);
    setPage(1); // Reset to first page on new search
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
          {filteredSpecifications
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((spec) => (
              <Grid
                item
                key={spec._id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleCardClick(spec._id)}
                >
                  <CardActionArea sx={{ flexGrow: 1 }}>
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
                        <Fab size="small" color="primary">
                          <EditIcon />
                        </Fab>
                        <Fab size="small" color="secondary" sx={{ ml: 2 }}>
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
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
      </Box>
    </>
  );
};

export default AllSpecifications;
