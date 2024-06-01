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
import { useNavigate, useParams } from "react-router-dom";

const steps = [
  "Add Unique Number and Estelam",
  "Select Directorate",
  "Add Specifications",
];

const AddSpecification = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  console.log(id)
  
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

        if (id) {
          const specRes = await axios.get(`http://localhost:3000/specifications/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          const specData = specRes.data;
          console.log(specData);
          setUniqueNumber(specData.uniqueNumber);
          setDocument(specData.document); // You might want to set the file input differently
          setDirectorate(specData.directorate._id);
          setSpecifications(specData.specifications.map(spec => ({
            category: spec.category._id,
            description: spec.description,
            categoryName: spec.category.categoryName, // Add this line to include categoryName
          })));          
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

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
          setMessage("All specifications must have a category and description.");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    let token = localStorage.getItem("usersdatatoken");

    const formData = new FormData();
    formData.append("uniqueNumber", uniqueNumber);
    formData.append("document", document);
    formData.append("directorate", directorate);
    specifications.forEach((spec, index) => {
      formData.append(`specifications[${index}][category]`, spec.categoryName);
      formData.append(`specifications[${index}][description]`, spec.description);
    });

    try {
      if (id) {
        await axios.put(`http://localhost:3000/specifications/${id}`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } else {
        await axios.post("http://localhost:3000/specifications", formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
      navigate("/specifications");
    } catch (error) {
      console.error(error);
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
        <Typography component="h1" variant="h5">
          {id ? "Edit Specification" : "Add Specification"}
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {activeStep === steps.length ? (
            <Typography variant="h5" gutterBottom>
              Specification {id ? "Updated" : "Added"} Successfully
            </Typography>
          ) : (
            <>
              {activeStep === 0 && (
                <Box>
                  <TextField
                    label="Unique Number"
                    fullWidth
                    margin="normal"
                    value={uniqueNumber}
                    onChange={(e) => setUniqueNumber(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ mt: 2 }}
                  >
                    Upload Document
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setDocument(e.target.files[0])}
                    />
                  </Button>
                </Box>
              )}
              {activeStep === 1 && (
                <TextField
                  select
                  label="Select Directorate"
                  fullWidth
                  margin="normal"
                  value={directorate}
                  onChange={(e) => setDirectorate(e.target.value)}
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
                        label="Category"
                        fullWidth
                        margin="normal"
                        value={spec.category}
                        onChange={(e) =>
                          setSpecifications((prevSpecs) => {
                            const newSpecs = [...prevSpecs];
                            newSpecs[index].category = e.target.value;
                            return newSpecs;
                          })
                        }
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat._id} value={cat._id}>
                            {cat.categoryName}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={spec.description}
                        onChange={(e) =>
                          setSpecifications((prevSpecs) => {
                            const newSpecs = [...prevSpecs];
                            newSpecs[index].description = e.target.value;
                            return newSpecs;
                          })
                        }
                      />
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setSpecifications((prevSpecs) => {
                            const newSpecs = prevSpecs.filter(
                              (spec, specIndex) => specIndex !== index
                            );
                            return newSpecs;
                          });
                        }}
                      >
                        Remove Specification
                      </Button>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    onClick={() =>
                      setSpecifications((prevSpecs) => [
                        ...prevSpecs,
                        { category: "", description: "" },
                      ])
                    }
                  >
                    Add Another Specification
                  </Button>
                </>
              )}
              {message && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {message}
                </Typography>
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default AddSpecification;
