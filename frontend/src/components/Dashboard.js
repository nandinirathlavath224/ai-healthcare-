import React, { useEffect, useState } from "react";

function Dashboard({ setPage }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
    totalPredictions: 0,
  });

  const [loading, setLoading] = useState(true);

  // ============================
  // SMART ALERTS
  // ============================

  const [showAlerts, setShowAlerts] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      icon: "⚠️",
      title: "AI Health Alert",
      message:
        "Review recent AI prediction results for critical health stages.",
      page: "history",
      time: "Recent",
    },
    {
      id: 2,
      type: "info",
      icon: "📅",
      title: "Appointment Reminder",
      message:
        "Check upcoming patient appointments and consultation schedules.",
      page: "appointments",
      time: "Today",
    },
    {
      id: 3,
      type: "success",
      icon: "💊",
      title: "Prescription Updates",
      message:
        "Review recently added prescriptions and treatment information.",
      page: "prescriptions",
      time: "Recent",
    },
    {
      id: 4,
      type: "normal",
      icon: "👥",
      title: "Patient Records",
      message:
        "Keep patient information and medical profiles up to date.",
      page: "patient",
      time: "Today",
    },
  ]);

  // ============================
  // LOAD DASHBOARD STATISTICS
  // ============================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dashboard"
      );

      if (!response.ok) {
        throw new Error("Dashboard API failed");
      }

      const data = await response.json();

      console.log("Dashboard Data:", data);

      setStats({
        totalPatients:
          data.totalPatients ??
          data.total_patients ??
          data.patients ??
          0,

        totalDoctors:
          data.totalDoctors ??
          data.total_doctors ??
          data.doctors ??
          0,

        totalAppointments:
          data.totalAppointments ??
          data.total_appointments ??
          data.appointments ??
          0,

        totalPrescriptions:
          data.totalPrescriptions ??
          data.total_prescriptions ??
          data.prescriptions ??
          0,

        totalPredictions:
          data.totalPredictions ??
          data.total_predictions ??
          data.predictions ??
          0,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // NAVIGATION
  // ============================

  const goTo = (page) => {
    if (typeof setPage === "function") {
      setPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setShowAlerts(false);
    } else {
      console.error("setPage function is missing");
    }
  };

  // ============================
  // STATISTICS
  // ============================

  const statistics = [
    {
      icon: "👥",
      title: "Patients",
      value: stats.totalPatients,
      subtitle: "Registered Patients",
      className: "blue",
      page: "patient",
    },

    {
      icon: "👨‍⚕️",
      title: "Doctors",
      value: stats.totalDoctors,
      subtitle: "Healthcare Specialists",
      className: "green",
      page: "doctor",
    },

    {
      icon: "📅",
      title: "Appointments",
      value: stats.totalAppointments,
      subtitle: "Appointments Booked",
      className: "orange",
      page: "appointments",
    },

    {
      icon: "💊",
      title: "Prescriptions",
      value: stats.totalPrescriptions,
      subtitle: "Prescriptions Issued",
      className: "purple",
      page: "prescriptions",
    },
  ];

  // ============================
  // FEATURES
  // ============================

  const features = [
    {
      icon: "👤",
      title: "Patient Management",
      description:
        "Add, view and manage patient information easily in one place.",
      page: "patient",
    },

    {
      icon: "👨‍⚕️",
      title: "Doctor Management",
      description:
        "View healthcare specialists and manage doctor information.",
      page: "doctor",
    },

    {
      icon: "🤖",
      title: "AI Disease Prediction",
      description:
        "Use machine learning to predict possible diseases from symptoms.",
      page: "prediction",
    },

    {
      icon: "📅",
      title: "Appointments",
      description:
        "Book and manage appointments between patients and doctors.",
      page: "appointments",
    },

    {
      icon: "💊",
      title: "Prescriptions",
      description:
        "View prescriptions and treatment information conveniently.",
      page: "prescriptions",
    },

    {
      icon: "📊",
      title: "Prediction History",
      description:
        "Review previous AI disease prediction results and records.",
      page: "history",
    },
  ];

  // ============================
  // QUICK ACTIONS
  // ============================

  const quickActions = [
    {
      icon: "➕",
      title: "Add Patient",
      description: "Register a new patient",
      page: "patient",
    },

    {
      icon: "🤖",
      title: "Predict Disease",
      description: "Start AI prediction",
      page: "prediction",
    },

    {
      icon: "📅",
      title: "Book Appointment",
      description: "Create an appointment",
      page: "appointmentForm",
    },

    {
      icon: "💊",
      title: "View Prescriptions",
      description: "Check prescriptions",
      page: "prescriptions",
    },
  ];

  // ============================
  // ALERT STYLE
  // ============================

  const getAlertClass = (type) => {
    if (type === "warning") return "alert-warning";
    if (type === "info") return "alert-info";
    if (type === "success") return "alert-success";

    return "alert-normal";
  };

  // ============================
  // UI
  // ============================

  return (
    <div className="home-dashboard">
      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .home-dashboard {
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
              rgba(0, 188, 212, 0.15),
              transparent 25%
            ),

            radial-gradient(
              circle at 90% 20%,
              rgba(76, 175, 80, 0.12),
              transparent 25%
            ),

            linear-gradient(
              135deg,
              #f4fbff,
              #eef8fc,
              #f8fcff
            );
        }

        .dashboard-container {
          width: 100%;
          max-width: 1400px;
          margin: auto;
        }

        /* =========================
           TOP DASHBOARD BAR
        ========================= */

        .dashboard-topbar {
          display: flex;

          justify-content: flex-end;

          align-items: center;

          margin-bottom: 18px;

          position: relative;

          z-index: 50;
        }

        .alert-wrapper {
          position: relative;
        }

        .alert-button {
          position: relative;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 11px 17px;

          border-radius: 13px;

          border: 1px solid #d7e8ef;

          background: white;

          color: #17445b;

          font-size: 14px;

          font-weight: 750;

          cursor: pointer;

          box-shadow:
            0 7px 20px rgba(30,80,100,0.09);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .alert-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 12px 25px rgba(30,80,100,0.14);
        }

        .bell-icon {
          font-size: 20px;
        }

        .alert-badge {
          position: absolute;

          top: -7px;

          right: -7px;

          min-width: 22px;

          height: 22px;

          padding: 0 6px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50px;

          background: #dc3545;

          color: white;

          border: 2px solid white;

          font-size: 11px;

          font-weight: 800;
        }

        /* =========================
           ALERT PANEL
        ========================= */

        .alert-panel {
          position: absolute;

          top: 53px;

          right: 0;

          width: 390px;

          max-width: calc(100vw - 30px);

          background: white;

          border-radius: 18px;

          border: 1px solid #dcebf1;

          box-shadow:
            0 18px 45px rgba(20,70,90,0.20);

          overflow: hidden;

          animation:
            alertAppear 0.2s ease;
        }

        @keyframes alertAppear {

          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .alert-panel-header {
          padding: 17px 18px;

          display: flex;

          justify-content: space-between;

          align-items: center;

          background:
            linear-gradient(
              135deg,
              #f2fbff,
              #ffffff
            );

          border-bottom:
            1px solid #e5eff3;
        }

        .alert-panel-header h3 {
          margin: 0;

          color: #075985;

          font-size: 17px;
        }

        .alert-count-text {
          font-size: 12px;

          font-weight: 700;

          color: #78909c;
        }

        .alert-list {
          max-height: 390px;

          overflow-y: auto;
        }

        .alert-item {
          display: flex;

          gap: 12px;

          padding: 15px 17px;

          border-bottom:
            1px solid #edf3f6;

          cursor: pointer;

          transition:
            background 0.2s;
        }

        .alert-item:hover {
          background: #f7fcfe;
        }

        .alert-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: grid;

          place-items: center;

          border-radius: 12px;

          font-size: 20px;
        }

        .alert-warning .alert-icon {
          background: #fff3cd;
        }

        .alert-info .alert-icon {
          background: #e0f5ff;
        }

        .alert-success .alert-icon {
          background: #e5f8eb;
        }

        .alert-normal .alert-icon {
          background: #f0f4f6;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title-row {
          display: flex;

          justify-content: space-between;

          gap: 10px;
        }

        .alert-title {
          color: #17445b;

          font-size: 14px;

          font-weight: 800;
        }

        .alert-time {
          color: #9aaab2;

          font-size: 10px;

          white-space: nowrap;
        }

        .alert-message {
          margin: 5px 0 0;

          color: #718692;

          font-size: 12px;

          line-height: 1.5;
        }

        .alert-panel-footer {
          padding: 12px 17px;

          text-align: center;

          background: #f8fbfd;
        }

        .view-history-button {
          border: none;

          background: transparent;

          color: #0077b6;

          font-size: 13px;

          font-weight: 800;

          cursor: pointer;
        }

        /* =========================
           HERO
        ========================= */

        .hero {
          position: relative;

          overflow: hidden;

          padding: 55px 50px;

          border-radius: 30px;

          background:
            linear-gradient(
              135deg,
              #023e8a,
              #0077b6 45%,
              #00b4d8
            );

          color: white;

          box-shadow:
            0 20px 55px rgba(0, 92, 130, 0.25);

          margin-bottom: 30px;
        }

        .hero::before {
          content: "";

          position: absolute;

          width: 350px;
          height: 350px;

          right: -120px;
          top: -190px;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.10);
        }

        .hero::after {
          content: "";

          position: absolute;

          width: 250px;
          height: 250px;

          left: 45%;
          bottom: -180px;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.07);
        }

        .hero-content {
          position: relative;

          z-index: 2;

          max-width: 950px;
        }

        .hero-badge {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding: 9px 17px;

          border-radius: 50px;

          background:
            rgba(255,255,255,0.15);

          border:
            1px solid rgba(255,255,255,0.25);

          font-size: 13px;

          font-weight: 700;

          letter-spacing: 0.5px;

          margin-bottom: 20px;
        }

        .hero h1 {
          margin: 0;

          font-size:
            clamp(34px, 5vw, 58px);

          line-height: 1.1;

          font-weight: 850;

          letter-spacing: -1.5px;
        }

        .hero h1 span {
          color: #b9f5ff;
        }

        .hero-text {
          margin-top: 20px;

          max-width: 850px;

          font-size: 18px;

          line-height: 1.7;

          color:
            rgba(255,255,255,0.93);
        }

        .hero-tagline {
          margin-top: 18px;

          font-size: 15px;

          font-weight: 650;

          color:
            rgba(255,255,255,0.82);
        }

        .hero-buttons {
          display: flex;

          gap: 12px;

          flex-wrap: wrap;

          margin-top: 28px;
        }

        .hero-button {
          padding: 14px 22px;

          border: none;

          border-radius: 11px;

          font-size: 14px;

          font-weight: 750;

          cursor: pointer;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .hero-button:hover {
          transform: translateY(-3px);

          box-shadow:
            0 10px 22px rgba(0,0,0,0.20);
        }

        .primary-button {
          background: white;

          color: #05668d;
        }

        .secondary-button {
          background:
            rgba(255,255,255,0.14);

          color: white;

          border:
            1px solid rgba(255,255,255,0.30);
        }

        /* =========================
           STATISTICS
        ========================= */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 20px;

          margin-bottom: 35px;
        }

        .stat-card {
          position: relative;

          overflow: hidden;

          min-height: 180px;

          padding: 25px;

          border-radius: 22px;

          color: white;

          box-shadow:
            0 12px 30px rgba(30,70,90,0.14);

          transition:
            transform 0.25s,
            box-shadow 0.25s;
        }

        .stat-card:hover {
          transform: translateY(-7px);

          box-shadow:
            0 20px 40px rgba(30,70,90,0.22);
        }

        .stat-card::after {
          content: "";

          position: absolute;

          width: 160px;
          height: 160px;

          right: -55px;
          bottom: -75px;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.12);
        }

        .blue {
          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00b4d8
            );
        }

        .green {
          background:
            linear-gradient(
              135deg,
              #2e9d4d,
              #67d84b
            );
        }

        .orange {
          background:
            linear-gradient(
              135deg,
              #ef8d16,
              #ffc107
            );
        }

        .purple {
          background:
            linear-gradient(
              135deg,
              #6a1b9a,
              #ab47bc
            );
        }

        .stat-header {
          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .stat-title {
          margin: 0;

          font-size: 17px;

          font-weight: 750;
        }

        .stat-icon {
          width: 52px;
          height: 52px;

          display: grid;

          place-items: center;

          border-radius: 15px;

          background:
            rgba(255,255,255,0.18);

          font-size: 27px;
        }

        .stat-number {
          margin-top: 18px;

          font-size: 40px;

          line-height: 1;

          font-weight: 850;
        }

        .stat-subtitle {
          margin-top: 9px;

          font-size: 13px;

          color:
            rgba(255,255,255,0.82);
        }

        .stat-open {
          position: relative;

          z-index: 3;

          margin-top: 15px;

          border: none;

          background: transparent;

          color: white;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          padding: 0;
        }

        /* =========================
           SECTION TITLE
        ========================= */

        .section-title {
          margin: 38px 0 20px;
        }

        .section-title h2 {
          margin: 0;

          color: #075985;

          font-size: 28px;

          font-weight: 800;
        }

        .section-title p {
          margin: 7px 0 0;

          color: #718692;

          font-size: 14px;
        }

        /* =========================
           FEATURES
        ========================= */

        .features-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 20px;
        }

        .feature-card {
          background:
            rgba(255,255,255,0.92);

          border:
            1px solid #e1eef4;

          border-radius: 20px;

          padding: 25px;

          box-shadow:
            0 8px 25px rgba(30,80,100,0.07);

          transition:
            transform 0.25s,
            box-shadow 0.25s,
            border-color 0.25s;
        }

        .feature-card:hover {
          transform: translateY(-6px);

          border-color: #9dd8e8;

          box-shadow:
            0 16px 35px rgba(30,80,100,0.14);
        }

        .feature-icon {
          width: 58px;
          height: 58px;

          display: grid;

          place-items: center;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #e5f8ff,
              #eefcff
            );

          font-size: 28px;

          margin-bottom: 18px;
        }

        .feature-card h3 {
          margin: 0;

          color: #17445b;

          font-size: 18px;
        }

        .feature-card p {
          color: #718692;

          font-size: 14px;

          line-height: 1.6;

          margin: 9px 0 18px;
        }

        .feature-button {
          border: none;

          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00a8c6
            );

          color: white;

          font-weight: 750;

          cursor: pointer;

          padding: 10px 15px;

          border-radius: 8px;

          font-size: 13px;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .feature-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 7px 15px rgba(0,119,182,0.25);
        }

        /* =========================
           QUICK ACTIONS
        ========================= */

        .quick-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 15px;
        }

        .quick-card {
          border: none;

          text-align: left;

          background: white;

          border-radius: 17px;

          padding: 20px;

          cursor: pointer;

          box-shadow:
            0 7px 22px rgba(30,80,100,0.08);

          border:
            1px solid #e4eef3;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .quick-card:hover {
          transform: translateY(-5px);

          box-shadow:
            0 14px 30px rgba(30,80,100,0.15);
        }

        .quick-icon {
          font-size: 28px;

          margin-bottom: 10px;
        }

        .quick-title {
          color: #17445b;

          font-weight: 800;

          font-size: 15px;
        }

        .quick-description {
          margin-top: 5px;

          color: #7b8d96;

          font-size: 12px;
        }

        /* =========================
           AI SECTION
        ========================= */

        .ai-section {
          position: relative;

          overflow: hidden;

          margin-top: 35px;

          padding: 35px;

          border-radius: 25px;

          background:
            linear-gradient(
              135deg,
              #071e3d,
              #123c68,
              #087ea4
            );

          color: white;

          box-shadow:
            0 15px 40px rgba(0,50,80,0.18);
        }

        .ai-section::after {
          content: "🤖";

          position: absolute;

          right: 45px;
          top: 25px;

          font-size: 85px;

          opacity: 0.12;
        }

        .ai-section h2 {
          position: relative;

          z-index: 2;

          margin: 0;

          font-size: 28px;
        }

        .ai-section p {
          position: relative;

          z-index: 2;

          max-width: 800px;

          color:
            rgba(255,255,255,0.82);

          line-height: 1.7;

          font-size: 15px;
        }

        .ai-button {
          position: relative;

          z-index: 3;

          margin-top: 10px;

          padding: 14px 23px;

          border: none;

          border-radius: 10px;

          background: white;

          color: #075985;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .ai-button:hover {
          transform: translateY(-3px);

          box-shadow:
            0 8px 20px rgba(0,0,0,0.2);
        }

        /* =========================
           FOOTER
        ========================= */

        .footer-message {
          text-align: center;

          margin-top: 42px;

          color: #78909c;

          font-size: 14px;
        }

        .footer-message strong {
          color: #0077b6;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1100px) {

          .stats-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .features-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .quick-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 650px) {

          .home-dashboard {
            padding:
              20px 12px 45px;
          }

          .dashboard-topbar {
            justify-content: flex-end;
          }

          .alert-panel {
            right: -5px;

            width: 350px;
          }

          .hero {
            padding:
              35px 22px;
          }

          .hero h1 {
            font-size: 33px;
          }

          .hero-text {
            font-size: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .quick-grid {
            grid-template-columns: 1fr;
          }

          .ai-section {
            padding: 25px 20px;
          }

          .ai-section::after {
            right: 15px;
            font-size: 55px;
          }

        }

      `}</style>

      <div className="dashboard-container">

        {/* =========================
            SMART ALERT BUTTON
        ========================= */}

        <div className="dashboard-topbar">

          <div className="alert-wrapper">

            <button
              type="button"
              className="alert-button"
              onClick={() =>
                setShowAlerts(!showAlerts)
              }
            >
              <span className="bell-icon">
                🔔
              </span>

              <span>
                Smart Alerts
              </span>

              {alerts.length > 0 && (
                <span className="alert-badge">
                  {alerts.length}
                </span>
              )}
            </button>

            {/* =========================
                ALERT PANEL
            ========================= */}

            {showAlerts && (

              <div className="alert-panel">

                <div className="alert-panel-header">

                  <h3>
                    🔔 Smart Alerts
                  </h3>

                  <span className="alert-count-text">
                    {alerts.length} notification
                    {alerts.length !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>

                <div className="alert-list">

                  {alerts.length === 0 ? (

                    <div
                      style={{
                        padding: "35px 20px",
                        textAlign: "center",
                        color: "#78909c",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "35px",
                          marginBottom: "10px",
                        }}
                      >
                        ✅
                      </div>

                      No new alerts
                    </div>

                  ) : (

                    alerts.map((alert) => (

                      <div
                        key={alert.id}
                        className={`alert-item ${getAlertClass(
                          alert.type
                        )}`}
                        onClick={() =>
                          goTo(alert.page)
                        }
                      >

                        <div className="alert-icon">
                          {alert.icon}
                        </div>

                        <div className="alert-content">

                          <div className="alert-title-row">

                            <span className="alert-title">
                              {alert.title}
                            </span>

                            <span className="alert-time">
                              {alert.time}
                            </span>

                          </div>

                          <p className="alert-message">
                            {alert.message}
                          </p>

                        </div>

                      </div>

                    ))

                  )}

                </div>

                <div className="alert-panel-footer">

                  <button
                    type="button"
                    className="view-history-button"
                    onClick={() =>
                      goTo("history")
                    }
                  >
                    📊 View Prediction History →
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

        {/* =========================
            HERO
        ========================= */}

        <section className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              🏥 SMART HEALTHCARE • AI POWERED
            </div>

            <h1>
              Welcome to
              <br />
              <span>AI Healthcare</span>
            </h1>

            <p className="hero-text">
              Where intelligent technology meets
              compassionate healthcare. Manage patients,
              doctors, appointments, prescriptions and
              AI-powered disease prediction — all from one
              beautiful platform.
            </p>

            <div className="hero-tagline">
              ✨ Better Care • Smarter Decisions •
              Healthier Lives
            </div>

            <div className="hero-buttons">

              <button
                className="hero-button primary-button"
                onClick={() => goTo("patient")}
              >
                👤 Manage Patients
              </button>

              <button
                className="hero-button secondary-button"
                onClick={() => goTo("prediction")}
              >
                🤖 Try AI Prediction
              </button>

            </div>

          </div>

        </section>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="stats-grid">

          {statistics.map((item) => (

            <div
              className={`stat-card ${item.className}`}
              key={item.title}
            >

              <div className="stat-header">

                <p className="stat-title">
                  {item.title}
                </p>

                <div className="stat-icon">
                  {item.icon}
                </div>

              </div>

              <div className="stat-number">
                {loading
                  ? "..."
                  : item.value}
              </div>

              <div className="stat-subtitle">
                {item.subtitle}
              </div>

              <button
                className="stat-open"
                onClick={() =>
                  goTo(item.page)
                }
              >
                View Details →
              </button>

            </div>

          ))}

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="section-title">

          <h2>
            ⚡ Quick Actions
          </h2>

          <p>
            Get things done quickly from your healthcare
            command center.
          </p>

        </div>

        <div className="quick-grid">

          {quickActions.map((action) => (

            <button
              key={action.title}
              className="quick-card"
              onClick={() =>
                goTo(action.page)
              }
            >

              <div className="quick-icon">
                {action.icon}
              </div>

              <div className="quick-title">
                {action.title}
              </div>

              <div className="quick-description">
                {action.description}
              </div>

            </button>

          ))}

        </div>

        {/* =========================
            FEATURES
        ========================= */}

        <div className="section-title">

          <h2>
            ⚡ Everything You Need
          </h2>

          <p>
            Powerful healthcare management tools designed
            for a smarter experience.
          </p>

        </div>

        <div className="features-grid">

          {features.map((feature) => (

            <div
              className="feature-card"
              key={feature.title}
            >

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

              <button
                className="feature-button"
                onClick={() =>
                  goTo(feature.page)
                }
              >
                Explore →
              </button>

            </div>

          ))}

        </div>

        {/* =========================
            AI HIGHLIGHT
        ========================= */}

        <section className="ai-section">

          <h2>
            🤖 Intelligent Healthcare Starts Here
          </h2>

          <p>
            Our machine-learning powered disease
            prediction system analyses selected symptoms
            and provides a possible disease prediction
            along with a suitable doctor recommendation.
          </p>

          <button
            className="ai-button"
            onClick={() =>
              goTo("prediction")
            }
          >
            🔍 Start AI Disease Prediction
          </button>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="footer-message">

          <strong>
            AI Healthcare
          </strong>

          {" "}— Bringing technology and healthcare
          together for a smarter tomorrow. 💙

        </div>

      </div>
    </div>
  );
}

export default Dashboard;