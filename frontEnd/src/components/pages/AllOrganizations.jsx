import Sidebar from "../layout/Sidebar"
import { Box, Paper, Typography } from "@mui/material"

const AllOrganizations = () => {
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
            height: "100vh"
          }}
        >
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 'auto'
            }}
          >
            <Typography component="h1" variant="h5">
              All Organizations
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  )
}

export default AllOrganizations
