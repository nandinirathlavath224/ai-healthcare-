import React, { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import PatientForm from "./components/PatientForm";
import PredictDisease from "./components/PredictDisease";
import DoctorDashboard from "./components/DoctorDashboard";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import PrescriptionList from "./components/PrescriptionList";
import PredictionHistory from "./components/PredictionHistory";
import PatientDashboard from "./components/PatientDashboard";
import PatientProfile from "./components/PatientProfile";
import SmartAlerts from "./components/SmartAlerts";
import DiseaseAnalytics from "./components/DiseaseAnalytics";

function App() {
  // =========================================
  // CURRENT PAGE
  // =========================================

  const [page, setPage] = useState("dashboard");

  // =========================================
  // SELECTED PATIENT
  // =========================================

  const [selectedPatient, setSelectedPatient] = useState(null);

  // =========================================
  // PATIENT DATA
  // =========================================

  const [patients, setPatients] = useState([]);

  // =========================================
  // GET PATIENTS
  // =========================================

  const getPatients = async () => {
    try {
      const response = await fetch(
        "https://ai-healthcare-backend-5dud.onrender.com/api/patients"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setPatients(data);
      } else if (data && Array.isArray(data.patients)) {
        setPatients(data.patients);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Patient fetch error:", error);
      setPatients([]);
    }
  };

  // =========================================
  // LOAD PATIENTS WHEN APP STARTS
  // =========================================

  useEffect(() => {
    getPatients();
  }, []);

  // =========================================
  // NAVIGATION
  // =========================================

  const navigate = (newPage, patient = null) => {
    console.log("Opening page:", newPage);

    // If a patient is provided, remember that patient
    if (patient) {
      setSelectedPatient(patient);
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // OPEN PATIENT PROFILE
  // =========================================

  const openPatientProfile = (patient) => {
    if (!patient) {
      alert("⚠️ Patient information not found.");
      return;
    }

    console.log("Opening patient profile:", patient);

    setSelectedPatient(patient);
    setPage("profile");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // RENDER CURRENT PAGE
  // =========================================

  const renderPage = () => {
    switch (page) {
      // =====================================
      // HOME DASHBOARD
      // =====================================

      case "dashboard":
        return (
          <Dashboard
            setPage={navigate}
          />
        );

      // =====================================
      // PATIENT DASHBOARD
      // =====================================

      case "patient":
        return (
          <PatientDashboard
            patients={patients}
            setPage={navigate}
            getPatients={getPatients}
            onViewProfile={openPatientProfile}
          />
        );

      // =====================================
      // PATIENT PROFILE
      // =====================================

      case "profile":
        if (!selectedPatient) {
          return (
            <div
              style={{
                minHeight: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
              }}
            >
              <div
                style={{
                  maxWidth: "600px",
                  width: "100%",
                  padding: "40px",
                  textAlign: "center",
                  background: "white",
                  borderRadius: "20px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.10)",
                }}
              >
                <div
                  style={{
                    fontSize: "55px",
                    marginBottom: "15px",
                  }}
                >
                  ⚠️
                </div>

                <h2
                  style={{
                    color: "#075985",
                    marginBottom: "10px",
                  }}
                >
                  No Patient Selected
                </h2>

                <p
                  style={{
                    color: "#718692",
                    lineHeight: "1.6",
                  }}
                >
                  Please return to the Patient Dashboard
                  and select a patient to view their profile.
                </p>

                <button
                  onClick={() => navigate("patient")}
                  style={{
                    marginTop: "15px",
                    padding: "13px 22px",
                    border: "none",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, #0077b6, #00b4d8)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  👤 Go to Patient Dashboard
                </button>
              </div>
            </div>
          );
        }

        return (
          <PatientProfile
            patient={selectedPatient}
            setPage={navigate}
            getPatients={getPatients}
          />
        );

      // =====================================
      // DOCTOR DASHBOARD
      // =====================================

      case "doctor":
        return (
          <DoctorDashboard
            setPage={navigate}
          />
        );

      // =====================================
      // ADMIN DASHBOARD
      // =====================================

      case "admin":
        return (
          <AdminDashboard
            setPage={navigate}
          />
        );

      // =====================================
      // PATIENT MANAGEMENT
      // =====================================

      case "patients":
        return (
          <PatientForm
            getPatients={getPatients}
            patients={patients}
          />
        );

      // =====================================
      // AI DISEASE PREDICTION
      // =====================================

      case "prediction":
        return (
          <PredictDisease
            setPage={navigate}
          />
        );

      // =====================================
      // APPOINTMENT FORM
      // =====================================

      case "appointmentForm":
        return (
          <AppointmentForm
            setPage={navigate}
          />
        );

      // =====================================
      // APPOINTMENTS
      // =====================================

      case "appointments":
        return (
          <AppointmentList
            setPage={navigate}
          />
        );

      // =====================================
      // PRESCRIPTIONS
      // =====================================

      case "prescriptions":
        return (
          <PrescriptionList
            setPage={navigate}
          />
        );

      // =====================================
      // PREDICTION HISTORY
      // =====================================

      case "history":
        return (
          <PredictionHistory
            setPage={navigate}
          />
        );

      // =====================================
      // SMART ALERTS
      // =====================================

      case "alerts":
        return (
          <SmartAlerts
            setPage={navigate}
          />
        );

      // =====================================
      // DISEASE ANALYTICS
      // =====================================

      case "analytics":
        return (
          <DiseaseAnalytics
            setPage={navigate}
          />
        );

      // =====================================
      // DEFAULT
      // =====================================

      default:
        return (
          <Dashboard
            setPage={navigate}
          />
        );
    }
  };

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #f5f9ff, #eef7ff)",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      {/* =====================================
          NAVBAR
      ===================================== */}

      <Navbar
        setPage={navigate}
        currentPage={page}
      />

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "25px",
          boxSizing: "border-box",
        }}
      >
        {renderPage()}
      </main>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer
        style={{
          marginTop: "50px",
          padding: "25px",
          textAlign: "center",

          background:
            "linear-gradient(135deg, #0077b6, #00b4d8)",

          color: "white",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px",
          }}
        >
          🏥 AI Healthcare Management System
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
          }}
        >
          AI Prediction • Appointments •
          Prescriptions • Analytics • Smart Alerts
        </p>
      </footer>

    </div>
  );
}

export default App;