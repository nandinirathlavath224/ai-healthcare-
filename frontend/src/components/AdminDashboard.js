import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);

      const [
        patientsResponse,
        doctorsResponse,
        appointmentsResponse,
        predictionsResponse,
        prescriptionsResponse,
      ] = await Promise.all([
        fetch("https://ai-healthcare-backend-5dud.onrender.com/api/patients"),
        fetch("https://ai-healthcare-backend-5dud.onrender.com/api/doctors"),
        fetch("https://ai-healthcare-backend-5dud.onrender.com/api/appointments"),
        fetch("https://ai-healthcare-backend-5dud.onrender.com/api/predictions"),
        fetch("https://ai-healthcare-backend-5dud.onrender.com/api/prescriptions"),
      ]);

      const patientsData = await patientsResponse.json();
      const doctorsData = await doctorsResponse.json();
      const appointmentsData = await appointmentsResponse.json();
      const predictionsData = await predictionsResponse.json();
      const prescriptionsData = await prescriptionsResponse.json();

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setAppointments(
        Array.isArray(appointmentsData) ? appointmentsData : []
      );
      setPredictions(
        Array.isArray(predictionsData) ? predictionsData : []
      );
      setPrescriptions(
        Array.isArray(prescriptionsData)
          ? prescriptionsData
          : []
      );
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Disease statistics
  const diseaseCounts = {};

  predictions.forEach((item) => {
    const disease = item.predicted_disease || "Unknown";

    diseaseCounts[disease] =
      (diseaseCounts[disease] || 0) + 1;
  });

  const diseaseStatistics = Object.entries(diseaseCounts)
    .sort((a, b) => b[1] - a[1]);

  // Appointment statistics
  const confirmedAppointments = appointments.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "confirmed"
  ).length;

  const pendingAppointments = appointments.filter(
    (item) =>
      !item.status ||
      String(item.status).toLowerCase() === "pending"
  ).length;

  const completedAppointments = appointments.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "completed"
  ).length;

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.smallText}>
            AI HEALTHCARE MANAGEMENT SYSTEM
          </p>

          <h1 style={styles.title}>
            🛡️ Admin Dashboard
          </h1>

          <p style={styles.subtitle}>
            Monitor and manage the complete healthcare system.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={getData}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Admin Profile */}
      <div style={styles.profileCard}>

        <div style={styles.adminIcon}>
          🛡️
        </div>

        <div>
          <h2 style={{ margin: 0 }}>
            System Administrator
          </h2>

          <p style={styles.profileText}>
            Healthcare System Management Portal
          </p>
        </div>

        <div style={styles.online}>
          <span style={styles.onlineDot}></span>
          System Online
        </div>

      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>

        <StatCard
          icon="👥"
          title="Total Patients"
          value={patients.length}
          description="Registered patients"
        />

        <StatCard
          icon="👨‍⚕️"
          title="Total Doctors"
          value={doctors.length}
          description="Healthcare professionals"
        />

        <StatCard
          icon="📅"
          title="Appointments"
          value={appointments.length}
          description="Scheduled appointments"
        />

        <StatCard
          icon="🤖"
          title="AI Predictions"
          value={predictions.length}
          description="ML assessments"
        />

        <StatCard
          icon="💊"
          title="Prescriptions"
          value={prescriptions.length}
          description="Medical prescriptions"
        />

      </div>

      {/* Appointment Analytics */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              📅 Appointment Overview
            </h2>

            <p style={styles.sectionSubtitle}>
              Current appointment statistics
            </p>
          </div>
        </div>

        <div style={styles.statusGrid}>

          <StatusCard
            icon="✅"
            title="Confirmed"
            value={confirmedAppointments}
          />

          <StatusCard
            icon="⏳"
            title="Pending"
            value={pendingAppointments}
          />

          <StatusCard
            icon="✔️"
            title="Completed"
            value={completedAppointments}
          />

          <StatusCard
            icon="📋"
            title="Total"
            value={appointments.length}
          />

        </div>

      </div>

      {/* Disease Analytics */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              🤖 Disease Prediction Analytics
            </h2>

            <p style={styles.sectionSubtitle}>
              Most frequently predicted diseases
            </p>
          </div>
        </div>

        {diseaseStatistics.length === 0 ? (
          <div style={styles.empty}>
            No prediction data available yet.
          </div>
        ) : (
          <div>

            {diseaseStatistics.map(
              ([disease, count], index) => {

                const percentage =
                  predictions.length > 0
                    ? (count / predictions.length) * 100
                    : 0;

                return (
                  <div
                    key={disease}
                    style={styles.diseaseRow}
                  >

                    <div style={styles.diseaseHeader}>

                      <div style={styles.diseaseName}>
                        <span style={styles.rank}>
                          #{index + 1}
                        </span>

                        <strong>
                          {disease}
                        </strong>
                      </div>

                      <span>
                        {count} prediction
                        {count !== 1 ? "s" : ""}{" "}
                        ({percentage.toFixed(1)}%)
                      </span>

                    </div>

                    <div style={styles.progressBackground}>

                      <div
                        style={{
                          ...styles.progressBar,
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* Recent Predictions */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              🧠 Recent AI Predictions
            </h2>

            <p style={styles.sectionSubtitle}>
              Latest disease prediction activity
            </p>
          </div>

        </div>

        {loading ? (
          <div style={styles.empty}>
            Loading prediction data...
          </div>
        ) : predictions.length === 0 ? (
          <div style={styles.empty}>
            No prediction history available.
          </div>
        ) : (
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Disease</th>
                  <th style={styles.th}>Model</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>

              <tbody>

                {predictions
                  .slice(0, 10)
                  .map((item) => (

                    <tr key={item.id}>

                      <td style={styles.td}>
                        #{item.id}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.patientCell}>

                          <div style={styles.patientAvatar}>
                            {String(
                              item.patient_name || "P"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {item.patient_name}
                          </strong>

                        </div>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.diseaseBadge}>
                          {item.predicted_disease}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {item.model_used || "AI Model"}
                      </td>

                      <td style={styles.td}>
                        {item.prediction_date}
                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* System Summary */}
      <div style={styles.summaryCard}>

        <div style={styles.summaryIcon}>
          🏥
        </div>

        <div>

          <h2 style={{ marginTop: 0 }}>
            Healthcare System Overview
          </h2>

          <p style={{ marginBottom: 0 }}>
            The system currently manages{" "}
            <strong>{patients.length}</strong>{" "}
            patients,{" "}
            <strong>{doctors.length}</strong>{" "}
            doctors,{" "}
            <strong>{appointments.length}</strong>{" "}
            appointments and{" "}
            <strong>{predictions.length}</strong>{" "}
            AI prediction records.
          </p>

        </div>

      </div>

      <p style={styles.footer}>
        🏥 AI Healthcare Management System • Admin Portal
      </p>

    </div>
  );
}


/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div style={styles.statCard}>

      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>

        <p style={styles.statTitle}>
          {title}
        </p>

        <h2 style={styles.statValue}>
          {value}
        </h2>

        <p style={styles.statDescription}>
          {description}
        </p>

      </div>

    </div>
  );
}


/* ================= STATUS CARD ================= */

function StatusCard({
  icon,
  title,
  value,
}) {
  return (
    <div style={styles.statusCard}>

      <div style={styles.statusIcon}>
        {icon}
      </div>

      <div>

        <p style={styles.statusTitle}>
          {title}
        </p>

        <h2 style={{ margin: "4px 0" }}>
          {value}
        </h2>

      </div>

    </div>
  );
}


/* ================= STYLES ================= */

const styles = {

  page: {
    maxWidth: "1350px",
    margin: "0 auto",
    padding: "10px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "25px",
  },

  smallText: {
    fontSize: "12px",
    letterSpacing: "2px",
    opacity: 0.6,
    marginBottom: "5px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    color: "#666",
    marginTop: "8px",
  },

  refreshButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#1565C0",
    color: "white",
    fontWeight: "bold",
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "22px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg, #0D47A1, #42A5F5)",
    color: "white",
    marginBottom: "25px",
    boxShadow:
      "0 8px 25px rgba(21,101,192,0.2)",
  },

  adminIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },

  profileText: {
    margin: "5px 0 0",
    opacity: 0.9,
  },

  online: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "14px",
  },

  onlineDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#69F0AE",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
  },

  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "#E3F2FD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  statTitle: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
  },

  statValue: {
    margin: "4px 0",
    fontSize: "27px",
  },

  statDescription: {
    margin: 0,
    fontSize: "12px",
    color: "#999",
  },

  section: {
    background: "white",
    borderRadius: "15px",
    padding: "22px",
    marginBottom: "25px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
  },

  sectionSubtitle: {
    color: "#777",
    fontSize: "14px",
    margin: "5px 0 0",
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "15px",
  },

  statusCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "12px",
  },

  statusIcon: {
    fontSize: "26px",
  },

  statusTitle: {
    margin: 0,
    color: "#666",
  },

  diseaseRow: {
    marginBottom: "20px",
  },

  diseaseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "7px",
  },

  diseaseName: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  rank: {
    background: "#E3F2FD",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#1565C0",
  },

  progressBackground: {
    width: "100%",
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #1565C0, #42A5F5)",
    borderRadius: "10px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#f5f7fa",
    color: "#555",
  },

  td: {
    padding: "13px",
    borderTop: "1px solid #eee",
  },

  patientCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  patientAvatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#E3F2FD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  diseaseBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#E8F5E9",
    color: "#2E7D32",
    fontSize: "12px",
    fontWeight: "bold",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "22px",
    borderRadius: "15px",
    background: "#E3F2FD",
    border: "1px solid #BBDEFB",
    marginBottom: "25px",
  },

  summaryIcon: {
    fontSize: "40px",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#777",
  },

  footer: {
    textAlign: "center",
    color: "#888",
    fontSize: "13px",
    marginTop: "30px",
  },

};

export default AdminDashboard;