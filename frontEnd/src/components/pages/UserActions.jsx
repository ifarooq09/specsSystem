import { Box, CircularProgress, Fab } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { Check, Save } from "@mui/icons-material";

const UserActions = ({ params, rowId, setRowId, onSave }) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(params.row); // Call the onSave function passed as a prop
      setSuccess(true);
      setRowId(null); // Reset the rowId after saving
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(rowId === params.id && success) {
      setSuccess(false)
    }
  }, [rowId])

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            "&:hover": { bgcolor: green[700] },
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          disabled={params.id !== rowId || loading}
          onClick={handleSubmit}
        >
          <Save />
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default UserActions;
