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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllSpecifications = () => {
  const navigate = useNavigate();
  const [specifications, setSpecifications] = useState([]);

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
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/specifications/${id}`);
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
          minHeight: "100vh", // Adjusted minHeight to ensure full viewport coverage
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
            All Specifications
          </Typography>
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
          {specifications
            .slice() // Create a shallow copy to avoid mutating the original array
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
            .map((spec) => (
              <Grid
                item
                key={spec._id}
                xs={12}
                sm={6}
                md={4}
                lg={3} // Adjusted grid size for larger screens
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
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {spec.uniqueNumber}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};

export default AllSpecifications;
