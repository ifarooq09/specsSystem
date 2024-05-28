import { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const steps = [
  "Add Unique Number and Estelam",
  "Select Directorate",
  "Add Specifications",
];

const AddSpecification = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [document, setDocument] = useState(null);
  const [directorate, setDirectorate] = useState("");
  const [specifications, setSpecifications] = useState([
    { category: "", description: "" },
  ]);
  const [directorates, setDirectorates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }
    const fetchData = async () => {
      try {
        const [dirRes, catRes] = await Promise.all([
          axios.get("http://localhost:3000/directorates", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
          axios.get("http://localhost:3000/categories", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
        ]);
        setDirectorates(dirRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!uniqueNumber || !document) {
        setMessage("Unique Number and document are required.");
        return;
      }
    } else if (activeStep === 1) {
      if (!directorate) {
        setMessage("Directorate is required.");
        return;
      }
    } else if (activeStep === 2) {
      for (const spec of specifications) {
        if (!spec.category || !spec.description) {
          setMessage("All category and description fields must be filled.");
          return;
        }
      }
    }
    setMessage("");
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setUniqueNumber("");
    setDocument(null);
    setDirectorate("");
    setSpecifications([{ category: "", description: "" }]);
    setMessage("");
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { category: "", description: "" }]);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async () => {
    let token = localStorage.getItem("usersdatatoken");

    if (!token) {
      alert("No user token found");
      return;
    }

    for (const spec of specifications) {
      if (!spec.category || !spec.description) {
        setMessage("All category and description fields must be filled.");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("uniqueNumber", uniqueNumber);
      formData.append("document", document);
      formData.append("directorate", directorate);
      formData.append("specifications", JSON.stringify(specifications));

      const response = await axios.post(
        "http://localhost:3000/specifications/addSpecification",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setMessage("Specification added successfully!");
      handleReset();
      navigate("/specifications");
    } catch (error) {
      console.error(error);
      setMessage("Error adding specification.");
    }
  };

  return (
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
          Provide New Specification
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you are finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
                {activeStep === 0 && (
                  <>
                    <TextField
                      label="Unique Number"
                      value={uniqueNumber}
                      onChange={(e) => setUniqueNumber(e.target.value)}
                      margin="normal"
                      fullWidth
                      required
                    />
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ mt: 2, mb: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </>
                )}
                {activeStep === 1 && (
                  <TextField
                    select
                    label="Select Directorate"
                    value={directorate}
                    onChange={(e) => setDirectorate(e.target.value)}
                    margin="normal"
                    fullWidth
                    required
                  >
                    {directorates.map((dir) => (
                      <MenuItem key={dir._id} value={dir._id}>
                        {dir.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                {activeStep === 2 && (
                  <>
                    {specifications.map((spec, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <TextField
                          select
                          label="Select Category"
                          value={spec.category}
                          onChange={(e) =>
                            handleSpecificationChange(
                              index,
                              "category",
                              e.target.value
                            )
                          }
                          margin="normal"
                          fullWidth
                          required
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                              {cat.categoryName}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          label="Description"
                          value={spec.description}
                          onChange={(e) =>
                            handleSpecificationChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          margin="normal"
                          fullWidth
                          required
                          multiline
                          rows={4} // Increased height
                        />
                        <Button
                          onClick={() => handleRemoveSpecification(index)}
                          sx={{ mt: 1 }}
                        >
                          Remove Specification
                        </Button>
                      </Box>
                    ))}
                    <Button onClick={handleAddSpecification} sx={{ mt: 2 }}>
                      Add Another Specification
                    </Button>
                  </>
                )}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {activeStep === steps.length - 1 ? (
                    <Button onClick={handleSubmit}>Finish</Button>
                  ) : (
                    <Button onClick={handleNext}>Next</Button>
                  )}
                </Box>
              </Box>
            </>
          )}
          {message && <Typography sx={{ mt: 2, mb: 1, color: 'red' }}>{message}</Typography>}
        </Box>
      </Paper>
    </Box>
  );
};

export default AddSpecification;
