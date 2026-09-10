import React, { useState } from "react";

function PatientDashboard({
  patients = [],
  getPatients,
  setPage,
  onViewProfile,
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // ADD PATIENT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter patient name");
      return;
    }

    if (!formData.age) {
      alert("Please enter patient age");
      return;
    }

    if (!formData.gender) {
      alert("Please select gender");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-healthcare-backend-5dud.onrender.com/api/patients/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            age: Number(formData.age),
            gender: formData.gender,
            phone: formData.phone.trim(),
            address: formData.address.trim(),
          }),
        }
      );

      const text = await response.text();

      console.log("Backend response:", text);

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Backend returned HTML instead of JSON. Please check the Patient API route."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add patient"
        );
      }

      alert("✅ Patient added successfully!");

      setFormData({
        name: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
      });

      setShowForm(false);

      if (getPatients) {
        await getPatients();
      }
    } catch (error) {
      console.error("Add patient error:", error);

      alert(
        "❌ Failed to add patient.\n\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE PATIENT
  // =========================================

  const deletePatient = async (id) => {
    if (!id) {
      alert("Patient ID not found");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(
        `https://ai-healthcare-backend-5dud.onrender.com/api/patients/${id}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      console.log("Delete response:", text);

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Backend returned HTML instead of JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete patient"
        );
      }

      alert("✅ Patient deleted successfully!");

      if (getPatients) {
        await getPatients();
      }
    } catch (error) {
      console.error("Delete patient error:", error);

      alert(
        "❌ Unable to delete patient.\n\n" +
          error.message
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // NAVIGATION
  // =========================================

  const navigateTo = (page) => {
    if (typeof setPage === "function") {
      setPage(page);
    }
  };

  // =========================================
  // VIEW PROFILE
  // =========================================

  const handleViewProfile = (patient) => {
    if (!patient) {
      alert("Patient information not found.");
      return;
    }

    if (typeof onViewProfile === "function") {
      onViewProfile(patient);
      return;
    }

    alert(
      "Patient profile navigation is not configured."
    );
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="patient-dashboard">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .patient-dashboard {
          min-height: calc(100vh - 70px);
          padding: 30px 20px 60px;

          font-family:
            "Segoe UI",
            Inter,
            Arial,
            sans-serif;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(0, 188, 212, 0.12),
              transparent 25%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(76, 175, 80, 0.10),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #f4fbff,
              #eef8fc,
              #f9fcff
            );
        }

        .patient-container {
          max-width: 1250px;
          margin: auto;
        }

        .patient-header {
          position: relative;
          overflow: hidden;

          padding: 35px;

          border-radius: 24px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #023e8a,
              #0077b6,
              #00b4d8
            );

          box-shadow:
            0 15px 40px rgba(0, 100, 150, 0.20);

          margin-bottom: 25px;
        }

        .patient-header::after {
          content: "";

          position: absolute;

          width: 220px;
          height: 220px;

          right: -80px;
          top: -100px;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.10);
        }

        .patient-header-content {
          position: relative;
          z-index: 2;
        }

        .patient-header h1 {
          margin: 0;

          font-size: 36px;

          font-weight: 850;
        }

        .patient-header p {
          margin: 10px 0 0;

          font-size: 16px;

          color:
            rgba(255,255,255,0.88);
        }

        .action-buttons {
          display: flex;

          gap: 12px;

          flex-wrap: wrap;

          margin-bottom: 25px;
        }

        .action-button {
          border: none;

          padding: 13px 20px;

          border-radius: 10px;

          color: white;

          font-size: 14px;

          font-weight: 750;

          cursor: pointer;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .action-button:hover {
          transform: translateY(-3px);

          box-shadow:
            0 8px 20px rgba(0,0,0,0.15);
        }

        .add-button {
          background:
            linear-gradient(
              135deg,
              #159957,
              #28a745
            );
        }

        .prediction-button {
          background:
            linear-gradient(
              135deg,
              #0066cc,
              #1565c0
            );
        }

        .appointment-button {
          background:
            linear-gradient(
              135deg,
              #00796b,
              #00897b
            );
        }

        .history-button {
          background:
            linear-gradient(
              135deg,
              #6a1b9a,
              #8e24aa
            );
        }

        .information-card,
        .form-card,
        .list-card {
          background: white;

          padding: 25px;

          border-radius: 20px;

          margin-bottom: 25px;

          box-shadow:
            0 8px 25px rgba(30,80,100,0.08);

          border:
            1px solid #e1eef4;
        }

        .information-card h2,
        .form-card h2,
        .list-card h2 {
          margin-top: 0;

          color: #075985;

          font-size: 22px;
        }

        .info-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;
        }

        .info-box {
          padding: 20px;

          border-radius: 14px;

          background: #f5faff;

          border:
            1px solid #e0edf5;
        }

        .info-box strong {
          color: #496b7a;

          font-size: 13px;
        }

        .info-value {
          margin-top: 8px;

          font-size: 19px;

          font-weight: 750;

          color: #17445b;
        }

        .form-grid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 18px;
        }

        .form-group {
          display: flex;

          flex-direction: column;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-group label {
          margin-bottom: 7px;

          font-weight: 700;

          color: #315363;

          font-size: 14px;
        }

        .form-input {
          width: 100%;

          padding: 13px;

          border:
            1px solid #ccdce4;

          border-radius: 9px;

          outline: none;

          font-size: 15px;
        }

        .form-input:focus {
          border-color: #00a6d6;

          box-shadow:
            0 0 0 3px rgba(0,166,214,0.10);
        }

        textarea.form-input {
          resize: vertical;
        }

        .form-actions {
          display: flex;

          gap: 12px;

          margin-top: 20px;
        }

        .save-button {
          flex: 1;

          padding: 14px;

          border: none;

          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #159957,
              #28a745
            );

          color: white;

          font-size: 15px;

          font-weight: 750;

          cursor: pointer;
        }

        .save-button:disabled {
          background: #999;

          cursor: not-allowed;
        }

        .cancel-button {
          padding: 14px 22px;

          border: none;

          border-radius: 9px;

          background: #eeeeee;

          color: #444;

          font-weight: 700;

          cursor: pointer;
        }

        .patient-table {
          width: 100%;

          min-width: 1050px;

          border-collapse: collapse;
        }

        .patient-table th {
          padding: 14px;

          text-align: left;

          color: white;

          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00a6d6
            );

          font-size: 14px;
        }

        .patient-table th:first-child {
          border-radius: 8px 0 0 0;
        }

        .patient-table th:last-child {
          border-radius: 0 8px 0 0;
        }

        .patient-table td {
          padding: 13px;

          border-bottom:
            1px solid #e5edf1;

          color: #385766;

          font-size: 14px;
        }

        .patient-table tbody tr:hover {
          background: #f6fbfd;
        }

        .profile-button {
          padding: 8px 12px;

          border: none;

          border-radius: 7px;

          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00a6d6
            );

          color: white;

          font-weight: 700;

          cursor: pointer;

          margin-right: 6px;
        }

        .profile-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 5px 12px
            rgba(0,119,182,0.25);
        }

        .delete-button {
          padding: 8px 12px;

          border: none;

          border-radius: 7px;

          background: #dc3545;

          color: white;

          font-weight: 700;

          cursor: pointer;
        }

        .delete-button:disabled {
          background: #999;

          cursor: not-allowed;
        }

        .empty-message {
          text-align: center;

          padding: 40px 20px;

          color: #78909c;

          background: #f8fbfd;

          border-radius: 12px;
        }

        .quick-services {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 15px;

          margin-top: 25px;
        }

        .service-card {
          padding: 20px;

          background: white;

          border-radius: 16px;

          border:
            1px solid #e1eef4;

          box-shadow:
            0 6px 20px rgba(30,80,100,0.06);

          text-align: center;

          cursor: pointer;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .service-card:hover {
          transform: translateY(-5px);

          box-shadow:
            0 12px 28px
            rgba(30,80,100,0.13);
        }

        .service-icon {
          font-size: 30px;

          margin-bottom: 8px;
        }

        .service-card strong {
          display: block;

          color: #17445b;
        }

        .service-card span {
          display: block;

          margin-top: 5px;

          font-size: 12px;

          color: #78909c;
        }

        @media (max-width: 900px) {

          .info-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .quick-services {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 650px) {

          .patient-dashboard {
            padding:
              20px 12px 40px;
          }

          .patient-header {
            padding: 25px 20px;
          }

          .patient-header h1 {
            font-size: 28px;
          }

          .info-grid,
          .form-grid,
          .quick-services {
            grid-template-columns: 1fr;
          }

          .form-group.full {
            grid-column: auto;
          }

          .form-actions {
            flex-direction: column;
          }

        }

      `}</style>

      <div className="patient-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="patient-header">

          <div className="patient-header-content">

            <h1>
              👤 Patient Dashboard
            </h1>

            <p>
              Manage patient information,
              healthcare services and
              AI-powered health assistance.
            </p>

          </div>

        </div>

        {/* =================================
            ACTION BUTTONS
        ================================= */}

        <div className="action-buttons">

          <button
            className="action-button add-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "✖ Close Form"
              : "➕ Add New Patient"}
          </button>

          <button
            className="action-button prediction-button"
            onClick={() =>
              navigateTo("prediction")
            }
          >
            🤖 AI Disease Prediction
          </button>

          <button
            className="action-button appointment-button"
            onClick={() =>
              navigateTo("appointments")
            }
          >
            📅 Appointments
          </button>

          <button
            className="action-button history-button"
            onClick={() =>
              navigateTo("history")
            }
          >
            📊 Prediction History
          </button>

        </div>

        {/* =================================
            PATIENT INFORMATION
        ================================= */}

        {patients.length > 0 && (

          <div className="information-card">

            <h2>
              🧑 Patient Information
            </h2>

            <div className="info-grid">

              <div className="info-box">

                <strong>
                  👤 PATIENT NAME
                </strong>

                <div className="info-value">
                  {patients[0].name || "-"}
                </div>

              </div>

              <div className="info-box">

                <strong>
                  🎂 AGE
                </strong>

                <div className="info-value">
                  {patients[0].age || "-"}
                </div>

              </div>

              <div className="info-box">

                <strong>
                  ⚧ GENDER
                </strong>

                <div className="info-value">
                  {patients[0].gender || "-"}
                </div>

              </div>

            </div>

          </div>

        )}

        {/* =================================
            ADD PATIENT FORM
        ================================= */}

        {showForm && (

          <div className="form-card">

            <h2>
              ➕ Add New Patient
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Patient Name *
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Age *
                  </label>

                  <input
                    className="form-input"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Gender *
                  </label>

                  <select
                    className="form-input"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />

                </div>

                <div className="form-group full">

                  <label>
                    Address
                  </label>

                  <textarea
                    className="form-input"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter patient address"
                    rows="3"
                  />

                </div>

              </div>

              <div className="form-actions">

                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading
                    ? "⏳ Saving Patient..."
                    : "💾 Save Patient"}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}

        {/* =================================
            PATIENT LIST
        ================================= */}

        <div className="list-card">

          <h2>
            📋 Patient List
          </h2>

          {patients.length === 0 ? (

            <div className="empty-message">

              <div
                style={{
                  fontSize: "40px",
                }}
              >
                👤
              </div>

              <p>
                No patients found.
              </p>

              <p>
                Click{" "}
                <strong>
                  ➕ Add New Patient
                </strong>{" "}
                to register a patient.
              </p>

            </div>

          ) : (

            <div
              style={{
                overflowX: "auto",
              }}
            >

              <table className="patient-table">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Patient Name</th>

                    <th>Age</th>

                    <th>Gender</th>

                    <th>Phone</th>

                    <th>Address</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {patients.map(
                    (patient, index) => {

                      const patientId =
                        patient.id ||
                        patient._id;

                      return (

                        <tr
                          key={
                            patientId ||
                            index
                          }
                        >

                          <td>
                            {patientId ||
                              index + 1}
                          </td>

                          <td>
                            {patient.name ||
                              "-"}
                          </td>

                          <td>
                            {patient.age ||
                              "-"}
                          </td>

                          <td>
                            {patient.gender ||
                              "-"}
                          </td>

                          <td>
                            {patient.phone ||
                              "-"}
                          </td>

                          <td>
                            {patient.address ||
                              "-"}
                          </td>

                          <td>

                            {/* VIEW PROFILE */}

                            <button
                              className="profile-button"
                              onClick={() =>
                                handleViewProfile(
                                  patient
                                )
                              }
                            >
                              👤 View Profile
                            </button>

                            {/* DELETE */}

                            <button
                              className="delete-button"
                              disabled={
                                deletingId ===
                                patientId
                              }
                              onClick={() =>
                                deletePatient(
                                  patientId
                                )
                              }
                            >
                              {deletingId ===
                              patientId
                                ? "Deleting..."
                                : "🗑️ Delete"}
                            </button>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================
            QUICK SERVICES
        ================================= */}

        <div className="quick-services">

          <div
            className="service-card"
            onClick={() =>
              navigateTo("prediction")
            }
          >

            <div className="service-icon">
              🤖
            </div>

            <strong>
              AI Prediction
            </strong>

            <span>
              Check symptoms
            </span>

          </div>

          <div
            className="service-card"
            onClick={() =>
              navigateTo("appointments")
            }
          >

            <div className="service-icon">
              📅
            </div>

            <strong>
              Appointments
            </strong>

            <span>
              Book consultation
            </span>

          </div>

          <div
            className="service-card"
            onClick={() =>
              navigateTo("history")
            }
          >

            <div className="service-icon">
              📊
            </div>

            <strong>
              Prediction History
            </strong>

            <span>
              View previous results
            </span>

          </div>

          <div
            className="service-card"
            onClick={() =>
              navigateTo("doctor")
            }
          >

            <div className="service-icon">
              👨‍⚕️
            </div>

            <strong>
              Doctors
            </strong>

            <span>
              Find specialists
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;