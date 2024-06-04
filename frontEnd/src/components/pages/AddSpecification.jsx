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
  const { id } = useParams(); // Get id from URL
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
  const [initialValues, setInitialValues] = useState({});

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:3000/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setDirectorates(dirRes.data);
        setCategories(catRes.data);

        // Fetch specification data if id is present
        if (id) {
          const specRes = await axios.get(
            `http://localhost:3000/specifications/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const specData = specRes.data;
          setInitialValues(specData)
          setUniqueNumber(specData.uniqueNumber);
          setDirectorate(specData.directorate._id);
          setSpecifications(
            specData.specifications.map((spec) => ({
              category: spec.category._id,
              description: spec.description,
            }))
          );
          // Don't require document if editing
          setDocument({ name: specData.document.split("/").pop() });
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [id]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!uniqueNumber || (!document && !id)) {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isSpecsChanged = specifications.some((spec, index) => {
        const oldSpec = id ? initialValues.specifications[index] : null;
        return (
            spec.category !== (oldSpec ? oldSpec.category._id : "") ||
            spec.description !== (oldSpec ? oldSpec.description : "")
        );
    });

    console.log("Spec is changed: " + isSpecsChanged);

    if (!isSpecsChanged) {
        navigate("/specifications");
        return;
    }

    const formData = new FormData();
    formData.append("uniqueNumber", uniqueNumber);
    if (document) formData.append("document", document);
    formData.append("directorate", directorate);
    formData.append("specifications", JSON.stringify(specifications));

    // Log formData contents
    for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
    }

    try {
        let token = localStorage.getItem("usersdatatoken");
        if (!token) {
            alert("No user token found");
            return;
        }
        let response;
        if (id) {
            response = await axios.put(
                `http://localhost:3000/specifications/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        } else {
            response = await axios.post(
                "http://localhost:3000/specifications/addSpecification",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        }
        console.log("Response from server:", response.data);
        navigate("/specifications");
    } catch (error) {
        console.error("Error submitting form", error);
        setMessage(`Error submitting form: ${error.response?.data?.message || error.message}`);
    }
};
  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { category: "", description: "" }]);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecifications);
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
              <Typography variant="h6" gutterBottom>
                Specification {id ? "Updated" : "Added"} Successfully!
              </Typography>
            ) : (
              <>
                {activeStep === 0 && (
                  <>
                    <TextField
                      required
                      id="uniqueNumber"
                      name="uniqueNumber"
                      label="Unique Number"
                      fullWidth
                      variant="outlined"
                      value={uniqueNumber}
                      onChange={(e) => setUniqueNumber(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ mb: 2 }}
                    >
                      Upload Document
                      <input
                        type="file"
                        hidden
                        onChange={(e) => setDocument(e.target.files[0])}
                      />
                    </Button>
                    {document && (
                      <Typography variant="body2">
                        {document.name || document}
                      </Typography>
                    )}
                  </>
                )}
                {activeStep === 1 && (
                  <TextField
                    select
                    required
                    id="directorate"
                    name="directorate"
                    label="Select Directorate"
                    fullWidth
                    variant="outlined"
                    value={directorate}
                    onChange={(e) => setDirectorate(e.target.value)}
                    sx={{ mb: 2 }}
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
                          required
                          id={`category-${index}`}
                          name={`category-${index}`}
                          label="Select Category"
                          fullWidth
                          variant="outlined"
                          value={spec.category}
                          onChange={(e) =>
                            handleSpecificationChange(
                              index,
                              "category",
                              e.target.value
                            )
                          }
                          sx={{ mb: 2 }}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                              {cat.categoryName}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          required
                          id={`description-${index}`}
                          name={`description-${index}`}
                          label="Description"
                          fullWidth
                          variant="outlined"
                          value={spec.description}
                          onChange={(e) =>
                            handleSpecificationChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          multiline
                          rows={10}
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleRemoveSpecification(index)}
                        >
                          Remove Specification
                        </Button>
                      </Box>
                    ))}
                    <Button
                      variant="contained"
                      onClick={handleAddSpecification}
                    >
                      Add Another Specification
                    </Button>
                  </>
                )}
                {message && (
                  <Typography color="error" variant="body2" sx={{ mt: 2 }}>
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
                    onClick={
                      activeStep === steps.length - 1
                        ? handleSubmit
                        : handleNext
                    }
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
    </>
  );
};

export default AddSpecification;
