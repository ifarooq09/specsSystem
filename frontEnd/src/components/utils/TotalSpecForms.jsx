import { Avatar, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { MdDevicesOther } from "react-icons/md";


const TotalSpecForms = () => {
  const [totalSpecForm, setTotalSpecForm] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("usersdatatoken")

    if (!token) {
      setErrorMessage("No user token found.");
      setIsLoading(false);
      return
    }

    const fetchSpecForms = async () => {
      try {
        const res = await fetch("http://localhost:3000/specifications", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!res.ok) {
          if (res.status === 403) {
            setErrorMessage("You do not have permission to view this content.")
          } else {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
        } else {
          const data = await res.json()
          setTotalSpecForm(data.specReport.length)
        }
      } catch (error) {
        console.error("Error fetching users:", error.message)
        setErrorMessage("An error occurred while fetching forms.")
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpecForms() // Call the function once within useEffect

  }, [])

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {isLoading ? (
        <>
          <Skeleton variant="text" width={120} height={40} />
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="text" width={50} height={30} />
        </>
      ) : errorMessage ? (
        <p style={{
          color: "red",
          fontSize: "18px",
          fontWeight: "bold",
        }}>
          {errorMessage}
        </p>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f4f8",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <p style={{
            fontWeight: "bold",
            fontSize: "22px",
            color: "#333"
          }}>
            Specification Forms
          </p>
          <Avatar style={{
            backgroundColor: "#4caf50",
            width: "60px",
            height: "60px",
            marginBottom: "10px",
          }}>
            <MdDevicesOther style={{
              color: "#ffffff",
              fontSize: "30px"
            }} />
          </Avatar>
          <p style={{
            fontSize: "20px",
            color: "#333",
            fontWeight: "bold",
          }}>
            {totalSpecForm}
          </p>
        </div>
      )}
    </div>
  )
}

export default TotalSpecForms
