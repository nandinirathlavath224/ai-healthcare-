import React, { useEffect, useState } from "react";

function PatientProfile({
  patient,
  setPage,
  getPatients,
}) {
  const [appointments, setAppointments] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // PATIENT ID
  // =========================================

  const patientId =
    patient?.id || patient?._id;

  // =========================================
  // GET PATIENT RELATED DATA
  // =========================================

  const loadPatientData = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // ---------------------------------------
      // APPOINTMENTS
      // ---------------------------------------

      try {
        const appointmentResponse =
          await fetch(
            "http://localhost:5000/api/appointments"
          );

        if (appointmentResponse.ok) {
          const appointmentData =
            await appointmentResponse.json();

          if (Array.isArray(appointmentData)) {
            const patientAppointments =
              appointmentData.filter(
                (item) =>
                  String(
                    item.patient_id ||
                      item.patientId ||
                      item.patient
                  ) === String(patientId)
              );

            setAppointments(
              patientAppointments
            );
          }
        }
      } catch (error) {
        console.log(
          "Appointment loading error:",
          error
        );
      }

      // ---------------------------------------
      // PREDICTIONS
      // ---------------------------------------

      try {
        const predictionResponse =
          await fetch(
            "http://localhost:5000/api/predictions"
          );

        if (predictionResponse.ok) {
          const predictionData =
            await predictionResponse.json();

          if (Array.isArray(predictionData)) {
            const patientPredictions =
              predictionData.filter(
                (item) =>
                  String(
                    item.patient_id ||
                      item.patientId ||
                      item.patient
                  ) === String(patientId)
              );

            setPredictions(
              patientPredictions
            );
          }
        }
      } catch (error) {
        console.log(
          "Prediction loading error:",
          error
        );
      }

      // ---------------------------------------
      // PRESCRIPTIONS
      // ---------------------------------------

      try {
        const prescriptionResponse =
          await fetch(
            "http://localhost:5000/api/prescriptions"
          );

        if (prescriptionResponse.ok) {
          const prescriptionData =
            await prescriptionResponse.json();

          if (Array.isArray(prescriptionData)) {
            const patientPrescriptions =
              prescriptionData.filter(
                (item) =>
                  String(
                    item.patient_id ||
                      item.patientId ||
                      item.patient
                  ) === String(patientId)
              );

            setPrescriptions(
              patientPrescriptions
            );
          }
        }
      } catch (error) {
        console.log(
          "Prescription loading error:",
          error
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  // =========================================
  // NAVIGATION
  // =========================================

  const goBack = () => {
    if (typeof setPage === "function") {
      setPage("patient");
    }
  };

  // =========================================
  // UI
  // =========================================

  if (!patient) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
        }}
      >
        <h2>⚠️ Patient Not Found</h2>

        <p>
          No patient was selected.
        </p>

        <button
          onClick={goBack}
          style={buttonStyle}
        >
          ← Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <style>{`

        .profile-page {
          min-height: calc(100vh - 70px);

          padding:
            30px 20px 60px;

          font-family:
            "Segoe UI",
            Arial,
            sans-serif;

          background:
            linear-gradient(
              135deg,
              #f2faff,
              #eef8ff,
              #f9fcff
            );
        }

        .profile-container {
          max-width: 1200px;

          margin: auto;
        }

        .profile-header {
          position: relative;

          overflow: hidden;

          padding: 35px;

          border-radius: 25px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #023e8a,
              #0077b6,
              #00b4d8
            );

          box-shadow:
            0 15px 40px
            rgba(0,100,150,0.18);

          margin-bottom: 25px;
        }

        .profile-header::after {
          content: "";

          position: absolute;

          width: 230px;
          height: 230px;

          right: -80px;
          top: -110px;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.10);
        }

        .profile-header-content {
          position: relative;

          z-index: 2;
        }

        .back-button {
          border: none;

          background:
            rgba(255,255,255,0.18);

          color: white;

          padding:
            10px 16px;

          border-radius: 9px;

          cursor: pointer;

          font-weight: 700;

          margin-bottom: 20px;
        }

        .back-button:hover {
          background:
            rgba(255,255,255,0.28);
        }

        .profile-title {
          display: flex;

          align-items: center;

          gap: 20px;
        }

        .profile-avatar {
          width: 75px;

          height: 75px;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 38px;

          background:
            rgba(255,255,255,0.18);

          border:
            2px solid
            rgba(255,255,255,0.35);
        }

        .profile-title h1 {
          margin: 0;

          font-size: 34px;
        }

        .profile-title p {
          margin: 6px 0 0;

          color:
            rgba(255,255,255,0.85);
        }

        .profile-card {
          background: white;

          border-radius: 20px;

          padding: 25px;

          margin-bottom: 22px;

          border:
            1px solid #dfedf4;

          box-shadow:
            0 8px 25px
            rgba(30,80,100,0.07);
        }

        .profile-card h2 {
          margin-top: 0;

          color: #075985;

          font-size: 21px;
        }

        .details-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;
        }

        .detail-box {
          padding: 18px;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #f7fcff,
              #edf8fc
            );

          border:
            1px solid #dfedf4;
        }

        .detail-label {
          font-size: 12px;

          font-weight: 800;

          color: #64808e;

          text-transform: uppercase;
        }

        .detail-value {
          margin-top: 7px;

          color: #17445b;

          font-size: 18px;

          font-weight: 750;
        }

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;
        }

        .stat-card {
          padding: 22px;

          border-radius: 16px;

          text-align: center;

          color: white;
        }

        .stat-card h3 {
          margin: 0;

          font-size: 30px;
        }

        .stat-card p {
          margin:
            7px 0 0;

          font-weight: 650;
        }

        .stat-blue {
          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00b4d8
            );
        }

        .stat-purple {
          background:
            linear-gradient(
              135deg,
              #6a1b9a,
              #9c27b0
            );
        }

        .stat-green {
          background:
            linear-gradient(
              135deg,
              #159957,
              #28a745
            );
        }

        .data-table-wrapper {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;

          border-collapse: collapse;

          min-width: 600px;
        }

        .data-table th {
          padding: 13px;

          text-align: left;

          color: white;

          background:
            #0077b6;
        }

        .data-table td {
          padding: 12px;

          border-bottom:
            1px solid #e5edf1;

          color: #45606c;
        }

        .data-table tr:hover {
          background: #f5fbfd;
        }

        .empty-data {
          padding: 25px;

          text-align: center;

          background: #f7fbfd;

          border-radius: 12px;

          color: #78909c;
        }

        .loading-box {
          padding: 30px;

          text-align: center;

          color: #607d8b;
        }

        @media (max-width: 800px) {

          .details-grid,
          .stats-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 550px) {

          .details-grid,
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .profile-title h1 {
            font-size: 27px;
          }

        }

      `}</style>

      <div className="profile-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="profile-header">

          <div className="profile-header-content">

            <button
              className="back-button"
              onClick={goBack}
            >
              ← Back to Patients
            </button>

            <div className="profile-title">

              <div className="profile-avatar">
                👤
              </div>

              <div>

                <h1>
                  {patient.name ||
                    "Patient Profile"}
                </h1>

                <p>
                  Complete healthcare profile
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================
            BASIC INFORMATION
        ================================= */}

        <div className="profile-card">

          <h2>
            🧑 Personal Information
          </h2>

          <div className="details-grid">

            <div className="detail-box">

              <div className="detail-label">
                Patient ID
              </div>

              <div className="detail-value">
                {patientId || "-"}
              </div>

            </div>

            <div className="detail-box">

              <div className="detail-label">
                Full Name
              </div>

              <div className="detail-value">
                {patient.name || "-"}
              </div>

            </div>

            <div className="detail-box">

              <div className="detail-label">
                Age
              </div>

              <div className="detail-value">
                {patient.age || "-"}
              </div>

            </div>

            <div className="detail-box">

              <div className="detail-label">
                Gender
              </div>

              <div className="detail-value">
                {patient.gender || "-"}
              </div>

            </div>

            <div className="detail-box">

              <div className="detail-label">
                Phone
              </div>

              <div className="detail-value">
                {patient.phone || "-"}
              </div>

            </div>

            <div className="detail-box">

              <div className="detail-label">
                Address
              </div>

              <div className="detail-value">
                {patient.address || "-"}
              </div>

            </div>

          </div>

        </div>

        {/* =================================
            HEALTHCARE STATISTICS
        ================================= */}

        <div className="profile-card">

          <h2>
            📊 Healthcare Overview
          </h2>

          <div className="stats-grid">

            <div className="stat-card stat-blue">

              <h3>
                {appointments.length}
              </h3>

              <p>
                Appointments
              </p>

            </div>

            <div className="stat-card stat-purple">

              <h3>
                {predictions.length}
              </h3>

              <p>
                AI Predictions
              </p>

            </div>

            <div className="stat-card stat-green">

              <h3>
                {prescriptions.length}
              </h3>

              <p>
                Prescriptions
              </p>

            </div>

          </div>

        </div>

        {/* =================================
            APPOINTMENTS
        ================================= */}

        <div className="profile-card">

          <h2>
            📅 Appointment History
          </h2>

          {loading ? (

            <div className="loading-box">
              ⏳ Loading appointments...
            </div>

          ) : appointments.length === 0 ? (

            <div className="empty-data">
              📅 No appointments found
              for this patient.
            </div>

          ) : (

            <div className="data-table-wrapper">

              <table className="data-table">

                <thead>

                  <tr>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Doctor
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          item._id ||
                          index
                        }
                      >

                        <td>
                          {item.appointment_date ||
                            item.date ||
                            "-"}
                        </td>

                        <td>
                          {item.appointment_time ||
                            item.time ||
                            "-"}
                        </td>

                        <td>
                          {item.doctor_name ||
                            item.doctor ||
                            "-"}
                        </td>

                        <td>
                          {item.status ||
                            "Pending"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================
            AI PREDICTIONS
        ================================= */}

        <div className="profile-card">

          <h2>
            🤖 AI Prediction History
          </h2>

          {loading ? (

            <div className="loading-box">
              ⏳ Loading predictions...
            </div>

          ) : predictions.length === 0 ? (

            <div className="empty-data">
              🤖 No AI predictions found
              for this patient.
            </div>

          ) : (

            <div className="data-table-wrapper">

              <table className="data-table">

                <thead>

                  <tr>

                    <th>
                      Disease
                    </th>

                    <th>
                      Health Stage
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {predictions.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          item._id ||
                          index
                        }
                      >

                        <td>
                          {item.predicted_disease ||
                            item.disease ||
                            item.prediction ||
                            "-"}
                        </td>

                        <td>
                          {item.health_stage ||
                            item.stage ||
                            "-"}
                        </td>

                        <td>
                          {item.created_at ||
                            item.date ||
                            "-"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================
            PRESCRIPTIONS
        ================================= */}

        <div className="profile-card">

          <h2>
            💊 Prescription History
          </h2>

          {loading ? (

            <div className="loading-box">
              ⏳ Loading prescriptions...
            </div>

          ) : prescriptions.length === 0 ? (

            <div className="empty-data">
              💊 No prescriptions found
              for this patient.
            </div>

          ) : (

            <div className="data-table-wrapper">

              <table className="data-table">

                <thead>

                  <tr>

                    <th>
                      Medicine
                    </th>

                    <th>
                      Dosage
                    </th>

                    <th>
                      Instructions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {prescriptions.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          item._id ||
                          index
                        }
                      >

                        <td>
                          {item.medicine ||
                            item.medication ||
                            item.medicine_name ||
                            "-"}
                        </td>

                        <td>
                          {item.dosage ||
                            "-"}
                        </td>

                        <td>
                          {item.instructions ||
                            item.notes ||
                            "-"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

const buttonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "9px",
  background: "#0077b6",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
};

export default PatientProfile;