import { Box, Paper, Typography, Button, IconButton, Alert } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { grey } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UserActions from "./UserActions";

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 403) {
            setErrorMessage("You do not have permission to view this content.");
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
        } else {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setErrorMessage("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  const handleSave = async (row) => {
    let token = localStorage.getItem("usersdatatoken");

    try {
      const res = await fetch(`http://localhost:3000/users/${row._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: row.role,
          active: row.active,
          password: row.password, // Add password to the update request
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        const updatedUsers = users.map((user) =>
          user._id === data.result._id
            ? {
                ...user,
                role: row.role,
                active: row.active,
                password: row.password,
              }
            : user
        );
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const handleTogglePassword = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "firstName", headerName: "First name", flex: 1 },
    { field: "lastName", headerName: "Last name", flex: 1 },
    { field: "email", headerName: "Email", flex: 2 },
    {
      field: "password",
      headerName: "Password",
      flex: 1,
      editable: true,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {params.isEditable && showPassword[params.row.id]
            ? params.value
            : '****'}
          <IconButton onClick={() => handleTogglePassword(params.row.id)} size="small">
            {showPassword[params.row.id] ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      type: "singleSelect",
      valueOptions: ["admin", "editor"],
      editable: true,
    },
    {
      field: "active",
      headerName: "Status",
      flex: 1,
      type: "boolean",
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => {
        return format(new Date(params.value), "yyyy-MM-dd HH:MM:SS");
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      renderCell: (params) => {
        return format(new Date(params.value), "yyyy-MM-dd HH:MM:SS");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <UserActions {...{ params, rowId, setRowId, onSave: handleSave }} />
        );
      },
    },
  ];

  const rows = users
    ? users.map((user, index) => ({
        id: index + 1,
        ...user,
      }))
    : [];

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
            All Users
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ my: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {!errorMessage && (
            <>
              <Button
                variant="contained"
                color="success"
                sx={{
                  width: "15%",
                  p: 1,
                  mt: 2,
                }}
                onClick={() => navigate("createUser")}
              >
                Add User
              </Button>
              <div style={{ height: 400, width: "100%", marginTop: 20 }}>
                <DataGrid
                  columns={columns}
                  rows={rows}
                  getRowSpacing={(params) => ({
                    top: params.isFirstVisible ? 0 : 5,
                    bottom: params.isLastVisible ? 0 : 5,
                  })}
                  sx={{
                    [`& .${gridClasses.row}`]: {
                      bgcolor: (theme) =>
                        theme.palette.mode === "light" ? grey[200] : grey[700],
                    },
                  }}
                  onCellEditStart={(params) => setRowId(params.id)}
                  onCellEditStop={(params) =>
                    setShowPassword((prev) => ({ ...prev, [params.id]: false }))
                  }
                  processRowUpdate={(newRow) => {
                    handleSave(newRow);
                    return newRow;
                  }}
                />
              </div>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default AllUsers;
