import React, { useEffect, useState } from "react";

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);

      const [patientsResponse, appointmentsResponse, predictionsResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/patients"),
          fetch("http://localhost:5000/api/appointments"),
          fetch("http://localhost:5000/api/predictions"),
        ]);

      const patientsData = await patientsResponse.json();
      const appointmentsData = await appointmentsResponse.json();
      const predictionsData = await predictionsResponse.json();

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setAppointments(
        Array.isArray(appointmentsData) ? appointmentsData : []
      );
      setPredictions(
        Array.isArray(predictionsData) ? predictionsData : []
      );
    } catch (error) {
      console.error("Doctor Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    String(patient.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const confirmedAppointments = appointments.filter(
    (appointment) =>
      String(appointment.status || "").toLowerCase() === "confirmed"
  ).length;

  const pendingAppointments = appointments.filter(
    (appointment) =>
      !appointment.status ||
      String(appointment.status).toLowerCase() === "pending"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) =>
      String(appointment.status || "").toLowerCase() === "completed"
  ).length;

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.smallText}>AI HEALTHCARE MANAGEMENT SYSTEM</p>

          <h1 style={styles.title}>
            👨‍⚕️ Doctor Dashboard
          </h1>

          <p style={styles.subtitle}>
            Monitor patients, appointments and AI-assisted healthcare insights.
          </p>
        </div>

        <button style={styles.refreshButton} onClick={getData}>
          🔄 Refresh
        </button>
      </div>

      {/* Doctor Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          👨‍⚕️
        </div>

        <div>
          <h2 style={{ margin: 0 }}>
            Doctor Portal
          </h2>

          <p style={styles.profileText}>
            Patient Care & Medical Monitoring
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
          icon="📅"
          title="Appointments"
          value={appointments.length}
          description="Total appointments"
        />

        <StatCard
          icon="🤖"
          title="AI Predictions"
          value={predictions.length}
          description="ML assessments"
        />

        <StatCard
          icon="✅"
          title="Completed"
          value={completedAppointments}
          description="Completed visits"
        />

      </div>

      {/* Appointment Status */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              📊 Appointment Overview
            </h2>

            <p style={styles.sectionSubtitle}>
              Current appointment status
            </p>
          </div>
        </div>

        <div style={styles.statusGrid}>

          <StatusCard
            title="Confirmed"
            value={confirmedAppointments}
            icon="✅"
          />

          <StatusCard
            title="Pending"
            value={pendingAppointments}
            icon="⏳"
          />

          <StatusCard
            title="Completed"
            value={completedAppointments}
            icon="✔️"
          />

        </div>
      </div>

      {/* Patients */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              👥 Patient Directory
            </h2>

            <p style={styles.sectionSubtitle}>
              Search and review registered patients
            </p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.search}
          />
        </div>

        {loading ? (
          <div style={styles.loading}>
            Loading patient information...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={styles.empty}>
            No patients found.
          </div>
        ) : (
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Gender</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>

                    <td style={styles.td}>
                      #{patient.id}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.patientCell}>

                        <div style={styles.patientAvatar}>
                          {String(patient.name || "P")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {patient.name}
                        </strong>

                      </div>
                    </td>

                    <td style={styles.td}>
                      {patient.age}
                    </td>

                    <td style={styles.td}>
                      {patient.gender}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.activeBadge}>
                        Active
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}
      </div>

      {/* Appointments */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>
            <h2 style={styles.sectionTitle}>
              📅 Appointment Schedule
            </h2>

            <p style={styles.sectionSubtitle}>
              Manage patient consultations
            </p>
          </div>

        </div>

        {appointments.length === 0 ? (
          <div style={styles.empty}>
            No appointments available.
          </div>
        ) : (
          <div style={styles.appointmentGrid}>

            {appointments.slice(0, 6).map((appointment) => (

              <div
                key={appointment.id}
                style={styles.appointmentCard}
              >

                <div style={styles.appointmentTop}>

                  <div style={styles.calendarIcon}>
                    📅
                  </div>

                  <span
                    style={
                      String(appointment.status || "")
                        .toLowerCase() === "confirmed"
                        ? styles.confirmedBadge
                        : String(appointment.status || "")
                            .toLowerCase() === "completed"
                        ? styles.completedBadge
                        : styles.pendingBadge
                    }
                  >
                    {appointment.status || "Pending"}
                  </span>

                </div>

                <h3 style={{ marginBottom: "5px" }}>
                  {appointment.patient_name}
                </h3>

                <p style={styles.appointmentInfo}>
                  👨‍⚕️ {appointment.doctor_name}
                </p>

                <p style={styles.appointmentInfo}>
                  📅 {appointment.appointment_date}
                </p>

                <p style={styles.appointmentInfo}>
                  🕐 {appointment.appointment_time}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* AI Insights */}
      <div style={styles.aiCard}>

        <div style={styles.aiIcon}>
          🤖
        </div>

        <div>

          <h2 style={{ marginTop: 0 }}>
            AI Healthcare Insights
          </h2>

          <p style={{ marginBottom: 0 }}>
            The system has processed{" "}
            <strong>{predictions.length}</strong>{" "}
            disease prediction assessments.
            Use AI predictions as decision-support information
            alongside professional medical evaluation.
          </p>

        </div>

      </div>

      <p style={styles.footer}>
        🏥 AI Healthcare Management System • Doctor Portal
      </p>

    </div>
  );
}


/* ---------------- STAT CARD ---------------- */

function StatCard({ icon, title, value, description }) {
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


/* ---------------- STATUS CARD ---------------- */

function StatusCard({ title, value, icon }) {
  return (
    <div style={styles.statusCard}>

      <div style={styles.statusIcon}>
        {icon}
      </div>

      <div>
        <p style={styles.statusTitle}>
          {title}
        </p>

        <h2 style={{ margin: "3px 0" }}>
          {value}
        </h2>
      </div>

    </div>
  );
}


/* ---------------- STYLES ---------------- */

const styles = {

  page: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "10px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },

  smallText: {
    fontSize: "12px",
    letterSpacing: "2px",
    marginBottom: "5px",
    opacity: 0.6,
  },

  title: {
    margin: "0",
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
    borderRadius: "14px",
    background: "linear-gradient(135deg, #1565C0, #42A5F5)",
    color: "white",
    marginBottom: "25px",
    boxShadow: "0 8px 25px rgba(21,101,192,0.2)",
  },

  avatar: {
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
      "repeat(auto-fit, minmax(210px, 1fr))",
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
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
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
    fontSize: "26px",
  },

  statDescription: {
    margin: 0,
    fontSize: "12px",
    color: "#999",
  },

  section: {
    background: "white",
    borderRadius: "14px",
    padding: "22px",
    marginBottom: "25px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
  },

  sectionSubtitle: {
    color: "#777",
    margin: "5px 0 0",
    fontSize: "14px",
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  statusCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px",
    borderRadius: "10px",
    background: "#f8fafc",
  },

  statusIcon: {
    fontSize: "25px",
  },

  statusTitle: {
    margin: 0,
    color: "#666",
  },

  search: {
    padding: "11px 15px",
    width: "260px",
    maxWidth: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
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

  activeBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#E8F5E9",
    color: "#2E7D32",
    fontSize: "12px",
    fontWeight: "bold",
  },

  appointmentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  appointmentCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    background: "#fafafa",
  },

  appointmentTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  calendarIcon: {
    fontSize: "25px",
  },

  confirmedBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#E8F5E9",
    color: "#2E7D32",
    fontSize: "12px",
    fontWeight: "bold",
  },

  pendingBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#FFF3E0",
    color: "#EF6C00",
    fontSize: "12px",
    fontWeight: "bold",
  },

  completedBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#E3F2FD",
    color: "#1565C0",
    fontSize: "12px",
    fontWeight: "bold",
  },

  appointmentInfo: {
    margin: "7px 0",
    color: "#666",
    fontSize: "14px",
  },

  aiCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "22px",
    borderRadius: "14px",
    background: "#f3e5f5",
    border: "1px solid #e1bee7",
    marginBottom: "25px",
  },

  aiIcon: {
    fontSize: "40px",
  },

  loading: {
    textAlign: "center",
    padding: "30px",
    color: "#777",
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

export default DoctorDashboard;