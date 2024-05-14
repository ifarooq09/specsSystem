import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button } from "@mui/material";

const AllDirectorates = () => {
  const navigate = useNavigate();

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
            All Directorates
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{
              width: "15%",
              p: 1,
              mt: 2,
            }}
            onClick={() => navigate("addDirectorate")}
          >
            Add Directorate
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default AllDirectorates;
