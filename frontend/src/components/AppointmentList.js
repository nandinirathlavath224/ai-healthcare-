import React, { useEffect, useState } from "react";

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // =========================
  // GET APPOINTMENTS
  // =========================

  const getAppointments = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-healthcare-backend-5dud.onrender.com/api/appointments"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Appointment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD APPOINTMENTS
  // =========================

  useEffect(() => {
    getAppointments();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `https://ai-healthcare-backend-5dud.onrender.com/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update appointment");
        return;
      }

      alert(
        data.message ||
          `Appointment ${status.toLowerCase()} successfully`
      );

      getAppointments();
    } catch (error) {
      console.error("Status update error:", error);

      alert("Appointment status update failed");
    }
  };

  // =========================
  // FILTER APPOINTMENTS
  // =========================

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        String(appointment.patient_name || "")
          .toLowerCase()
          .includes(search) ||
        String(appointment.doctor_name || "")
          .toLowerCase()
          .includes(search);

      const currentStatus =
        appointment.status || "Pending";

      const matchesStatus =
        statusFilter === "All" ||
        currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // =========================
  // STATISTICS
  // =========================

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) =>
      (appointment.status || "Pending") === "Pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Cancelled"
  ).length;

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return {
          background: "#e8f5e9",
          color: "#2e7d32",
          border: "1px solid #a5d6a7",
        };

      case "Completed":
        return {
          background: "#e3f2fd",
          color: "#1565c0",
          border: "1px solid #90caf9",
        };

      case "Cancelled":
        return {
          background: "#ffebee",
          color: "#c62828",
          border: "1px solid #ef9a9a",
        };

      default:
        return {
          background: "#fff8e1",
          color: "#ef6c00",
          border: "1px solid #ffcc80",
        };
    }
  };

  return (
    <div className="appointment-dashboard">
      <style>{`

        * {
          box-sizing: border-box;
        }

        .appointment-dashboard {
          min-height: calc(100vh - 70px);
          padding: 35px 20px 60px;
          font-family:
            "Segoe UI",
            Inter,
            Arial,
            sans-serif;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(0,188,212,0.12),
              transparent 25%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(76,175,80,0.10),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #f4fbff,
              #eef8fc,
              #f8fcff
            );
        }

        .appointment-container {
          max-width: 1400px;
          margin: auto;
        }

        /* =========================
           HEADER
        ========================= */

        .appointment-hero {
          position: relative;
          overflow: hidden;

          padding: 38px;

          border-radius: 26px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #023e8a,
              #0077b6,
              #00b4d8
            );

          box-shadow:
            0 18px 45px rgba(0,90,130,0.20);

          margin-bottom: 25px;
        }

        .appointment-hero::after {
          content: "";

          position: absolute;

          width: 260px;
          height: 260px;

          right: -80px;
          top: -130px;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.10);
        }

        .appointment-hero-content {
          position: relative;
          z-index: 2;
        }

        .appointment-badge {
          display: inline-block;

          padding: 8px 14px;

          border-radius: 30px;

          background:
            rgba(255,255,255,0.15);

          border:
            1px solid rgba(255,255,255,0.25);

          font-size: 12px;

          font-weight: 700;

          margin-bottom: 14px;
        }

        .appointment-hero h1 {
          margin: 0;

          font-size:
            clamp(30px, 5vw, 48px);

          font-weight: 850;

          letter-spacing: -1px;
        }

        .appointment-hero p {
          margin: 12px 0 0;

          max-width: 800px;

          line-height: 1.7;

          color:
            rgba(255,255,255,0.88);

          font-size: 16px;
        }

        /* =========================
           STATISTICS
        ========================= */

        .appointment-stats {
          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 15px;

          margin-bottom: 25px;
        }

        .appointment-stat {
          background: white;

          padding: 20px;

          border-radius: 18px;

          border:
            1px solid #e1edf3;

          box-shadow:
            0 8px 25px rgba(30,70,90,0.08);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .appointment-stat:hover {
          transform: translateY(-4px);

          box-shadow:
            0 14px 30px rgba(30,70,90,0.14);
        }

        .appointment-stat-icon {
          font-size: 25px;

          margin-bottom: 8px;
        }

        .appointment-stat-title {
          font-size: 13px;

          color: #718692;

          font-weight: 600;
        }

        .appointment-stat-number {
          margin-top: 5px;

          font-size: 30px;

          font-weight: 850;

          color: #17445b;
        }

        /* =========================
           TOOLBAR
        ========================= */

        .appointment-toolbar {
          display: flex;

          gap: 12px;

          flex-wrap: wrap;

          align-items: center;

          background: white;

          padding: 18px;

          border-radius: 18px;

          border:
            1px solid #e1edf3;

          box-shadow:
            0 8px 25px rgba(30,70,90,0.07);

          margin-bottom: 22px;
        }

        .search-wrapper {
          position: relative;

          flex: 1;

          min-width: 240px;
        }

        .search-icon {
          position: absolute;

          left: 14px;
          top: 50%;

          transform:
            translateY(-50%);

          font-size: 17px;
        }

        .search-input {
          width: 100%;

          padding:
            13px 15px 13px 43px;

          border:
            1px solid #ccdce5;

          border-radius: 10px;

          outline: none;

          font-size: 14px;

          transition:
            border 0.2s,
            box-shadow 0.2s;
        }

        .search-input:focus {
          border-color: #00a6c7;

          box-shadow:
            0 0 0 3px rgba(0,166,199,0.10);
        }

        .status-select {
          padding: 13px 15px;

          border:
            1px solid #ccdce5;

          border-radius: 10px;

          background: white;

          font-size: 14px;

          min-width: 150px;

          outline: none;
        }

        .refresh-button {
          padding:
            13px 18px;

          border: none;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00b4d8
            );

          color: white;

          font-weight: 750;

          cursor: pointer;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .refresh-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 7px 18px
            rgba(0,119,182,0.25);
        }

        .refresh-button:disabled {
          opacity: 0.65;

          cursor: not-allowed;
        }

        /* =========================
           TABLE CARD
        ========================= */

        .table-card {
          background: white;

          border-radius: 22px;

          border:
            1px solid #e1edf3;

          box-shadow:
            0 10px 30px rgba(30,70,90,0.08);

          overflow: hidden;
        }

        .table-header {
          display: flex;

          justify-content:
            space-between;

          align-items: center;

          padding: 22px 24px;

          border-bottom:
            1px solid #e7eef2;

          gap: 10px;

          flex-wrap: wrap;
        }

        .table-header h2 {
          margin: 0;

          color: #17445b;

          font-size: 21px;
        }

        .result-count {
          padding:
            7px 12px;

          border-radius: 20px;

          background: #eef8fc;

          color: #0077b6;

          font-size: 12px;

          font-weight: 750;
        }

        .table-scroll {
          overflow-x: auto;
        }

        table {
          width: 100%;

          min-width: 900px;

          border-collapse:
            collapse;
        }

        thead tr {
          background:
            linear-gradient(
              135deg,
              #f0faff,
              #e8f7fc
            );
        }

        th {
          padding: 15px;

          text-align: left;

          color: #31566a;

          font-size: 12px;

          text-transform:
            uppercase;

          letter-spacing:
            0.4px;

          border-bottom:
            1px solid #dcebf1;
        }

        td {
          padding: 16px 15px;

          border-bottom:
            1px solid #edf2f5;

          color: #405865;

          font-size: 14px;
        }

        tbody tr {
          transition:
            background 0.2s;
        }

        tbody tr:hover {
          background: #f8fcfe;
        }

        .appointment-id {
          font-weight: 800;

          color: #0077b6;
        }

        .patient-name {
          font-weight: 750;

          color: #17445b;
        }

        .doctor-name {
          font-weight: 650;

          color: #31566a;
        }

        .date-time {
          white-space: nowrap;
        }

        .date {
          font-weight: 700;

          color: #17445b;
        }

        .time {
          margin-top: 4px;

          color: #81929c;

          font-size: 12px;
        }

        .status-badge {
          display: inline-block;

          padding:
            7px 11px;

          border-radius: 20px;

          font-size: 12px;

          font-weight: 800;
        }

        /* =========================
           ACTIONS
        ========================= */

        .action-buttons {
          display: flex;

          gap: 6px;

          flex-wrap: wrap;
        }

        .action-button {
          border: none;

          padding:
            7px 10px;

          border-radius: 7px;

          color: white;

          font-size: 11px;

          font-weight: 750;

          cursor: pointer;

          transition:
            transform 0.15s,
            opacity 0.15s;
        }

        .action-button:hover {
          transform:
            translateY(-2px);

          opacity: 0.9;
        }

        .confirm-button {
          background: #2e9d4d;
        }

        .cancel-button {
          background: #dc3545;
        }

        .complete-button {
          background: #0077b6;
        }

        /* =========================
           EMPTY
        ========================= */

        .empty-state {
          text-align: center;

          padding: 60px 20px;

          color: #718692;
        }

        .empty-icon {
          font-size: 55px;

          margin-bottom: 12px;
        }

        .empty-state h3 {
          margin: 0 0 8px;

          color: #31566a;
        }

        .empty-state p {
          margin: 0;

          font-size: 14px;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1100px) {
          .appointment-stats {
            grid-template-columns:
              repeat(3, 1fr);
          }
        }

        @media (max-width: 700px) {
          .appointment-dashboard {
            padding:
              20px 12px 45px;
          }

          .appointment-hero {
            padding: 28px 22px;
          }

          .appointment-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .appointment-toolbar {
            align-items: stretch;
          }

          .status-select,
          .refresh-button {
            width: 100%;
          }

          .search-wrapper {
            width: 100%;
          }
        }

        @media (max-width: 450px) {
          .appointment-stats {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

      <div className="appointment-container">

        {/* =========================
            HERO
        ========================= */}

        <section className="appointment-hero">

          <div className="appointment-hero-content">

            <div className="appointment-badge">
              📅 SMART APPOINTMENT CENTER
            </div>

            <h1>
              Appointment Management
            </h1>

            <p>
              Organize patient visits, coordinate with
              doctors and keep every appointment on track
              with a simple and intelligent healthcare
              workspace.
            </p>

          </div>

        </section>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="appointment-stats">

          <div className="appointment-stat">
            <div className="appointment-stat-icon">
              📅
            </div>

            <div className="appointment-stat-title">
              Total
            </div>

            <div className="appointment-stat-number">
              {totalAppointments}
            </div>
          </div>

          <div className="appointment-stat">
            <div className="appointment-stat-icon">
              ⏳
            </div>

            <div className="appointment-stat-title">
              Pending
            </div>

            <div className="appointment-stat-number">
              {pendingAppointments}
            </div>
          </div>

          <div className="appointment-stat">
            <div className="appointment-stat-icon">
              ✅
            </div>

            <div className="appointment-stat-title">
              Confirmed
            </div>

            <div className="appointment-stat-number">
              {confirmedAppointments}
            </div>
          </div>

          <div className="appointment-stat">
            <div className="appointment-stat-icon">
              🎉
            </div>

            <div className="appointment-stat-title">
              Completed
            </div>

            <div className="appointment-stat-number">
              {completedAppointments}
            </div>
          </div>

          <div className="appointment-stat">
            <div className="appointment-stat-icon">
              ❌
            </div>

            <div className="appointment-stat-title">
              Cancelled
            </div>

            <div className="appointment-stat-number">
              {cancelledAppointments}
            </div>
          </div>

        </div>

        {/* =========================
            SEARCH TOOLBAR
        ========================= */}

        <div className="appointment-toolbar">

          <div className="search-wrapper">

            <span className="search-icon">
              🔎
            </span>

            <input
              className="search-input"
              type="text"
              placeholder="Search patient or doctor..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          <button
            className="refresh-button"
            onClick={getAppointments}
            disabled={loading}
          >
            {loading
              ? "⏳ Loading..."
              : "🔄 Refresh"}
          </button>

        </div>

        {/* =========================
            APPOINTMENT TABLE
        ========================= */}

        <div className="table-card">

          <div className="table-header">

            <h2>
              📋 Appointment Records
            </h2>

            <span className="result-count">
              {filteredAppointments.length} Results
            </span>

          </div>

          {filteredAppointments.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📭
              </div>

              <h3>
                No Appointments Found
              </h3>

              <p>
                Try changing your search or status
                filter.
              </p>

            </div>

          ) : (

            <div className="table-scroll">

              <table>

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredAppointments.map(
                    (appointment) => {

                      const status =
                        appointment.status ||
                        "Pending";

                      return (

                        <tr
                          key={appointment.id}
                        >

                          <td>
                            <span className="appointment-id">
                              #{appointment.id}
                            </span>
                          </td>

                          <td>
                            <span className="patient-name">
                              {appointment.patient_name ||
                                "-"}
                            </span>
                          </td>

                          <td>
                            <span className="doctor-name">
                              👨‍⚕️{" "}
                              {appointment.doctor_name ||
                                "-"}
                            </span>
                          </td>

                          <td className="date-time">

                            <div className="date">
                              📅{" "}
                              {appointment.appointment_date ||
                                "-"}
                            </div>

                            <div className="time">
                              🕐{" "}
                              {appointment.appointment_time ||
                                "-"}
                            </div>

                          </td>

                          <td>

                            <span
                              className="status-badge"
                              style={getStatusStyle(
                                status
                              )}
                            >
                              {status ===
                                "Confirmed" &&
                                "✓ "}

                              {status ===
                                "Completed" &&
                                "✓ "}

                              {status ===
                                "Cancelled" &&
                                "✕ "}

                              {status ===
                                "Pending" &&
                                "⏳ "}

                              {status}
                            </span>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="action-button confirm-button"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "Confirmed"
                                  )
                                }
                              >
                                ✓ Confirm
                              </button>

                              <button
                                className="action-button cancel-button"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "Cancelled"
                                  )
                                }
                              >
                                ✕ Cancel
                              </button>

                              <button
                                className="action-button complete-button"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "Completed"
                                  )
                                }
                              >
                                ✓ Complete
                              </button>

                            </div>

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

      </div>

    </div>
  );
}

export default AppointmentList;