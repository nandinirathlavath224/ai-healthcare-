import React, { useEffect, useState } from "react";

function SmartAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // GET PATIENT NAME
  // =====================================================

  const getPatientName = (item) => {
    return (
      item.patientName ||
      item.patient_name ||
      item.patient ||
      item.name ||
      "Patient"
    );
  };

  // =====================================================
  // LOAD ALL ALERTS
  // =====================================================

  const loadAlerts = async () => {
    setLoading(true);

    const newAlerts = [];

    // ===================================================
    // 1. AI PREDICTION ALERTS
    // ===================================================

    try {
      const response = await fetch(
        "http://localhost:5000/api/predictions"
      );

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          data.forEach((prediction) => {
            const patientName =
              getPatientName(prediction);

            const disease =
              prediction.predictedDisease ||
              prediction.predicted_disease ||
              prediction.disease ||
              prediction.prediction ||
              "Unknown Disease";

            const model =
              prediction.modelUsed ||
              prediction.model_used ||
              "AI Model";

            const predictionDate =
              prediction.predictionDate ||
              prediction.prediction_date ||
              prediction.createdAt ||
              prediction.created_at;

            newAlerts.push({
              id:
                "prediction-" +
                (prediction.id ||
                  prediction._id ||
                  Math.random()),

              type: "prediction",

              icon: "🤖",

              title: "New AI Prediction",

              message:
                `${patientName}'s AI prediction: ` +
                `${disease}. ` +
                `Model used: ${model}.`,

              time:
                predictionDate
                  ? formatDate(predictionDate)
                  : "Prediction History",
            });
          });
        }
      }
    } catch (error) {
      console.log(
        "Prediction alerts skipped:",
        error.message
      );
    }

    // ===================================================
    // 2. APPOINTMENT ALERTS
    // ===================================================

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments"
      );

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          data.forEach((appointment) => {
            const patientName =
              getPatientName(appointment);

            const doctorName =
              appointment.doctorName ||
              appointment.doctor_name ||
              appointment.doctor ||
              "Doctor";

            const status =
              String(
                appointment.status || "scheduled"
              ).toLowerCase();

            const appointmentDate =
              appointment.appointmentDate ||
              appointment.appointment_date ||
              appointment.date ||
              appointment.scheduledDate ||
              appointment.scheduled_date;

            // ---------------------------------------------
            // CANCELLED
            // ---------------------------------------------

            if (status === "cancelled") {
              newAlerts.push({
                id:
                  "cancelled-" +
                  (appointment.id ||
                    appointment._id ||
                    Math.random()),

                type: "warning",

                icon: "❌",

                title: "Appointment Cancelled",

                message:
                  `Appointment for ${patientName} ` +
                  `with ${doctorName} has been cancelled.`,

                time:
                  appointmentDate
                    ? formatDate(appointmentDate)
                    : "Appointments",
              });

              return;
            }

            // ---------------------------------------------
            // COMPLETED
            // ---------------------------------------------

            if (status === "completed") {
              return;
            }

            // ---------------------------------------------
            // SCHEDULED
            // ---------------------------------------------

            newAlerts.push({
              id:
                "appointment-" +
                (appointment.id ||
                  appointment._id ||
                  Math.random()),

              type: "appointment",

              icon: "📅",

              title: "Upcoming Appointment",

              message:
                `${patientName} has an appointment ` +
                `with ${doctorName}.`,

              time:
                appointmentDate
                  ? formatDate(appointmentDate)
                  : "Appointments",
            });
          });
        }
      }
    } catch (error) {
      console.log(
        "Appointment alerts skipped:",
        error.message
      );
    }

    // ===================================================
    // 3. PRESCRIPTION ALERTS
    // ===================================================

    try {
      const response = await fetch(
        "http://localhost:5000/api/prescriptions"
      );

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          data.forEach((prescription) => {
            const patientName =
              getPatientName(prescription);

            const medicine =
              prescription.medicine ||
              prescription.medication ||
              prescription.medicineName ||
              prescription.medicine_name ||
              "";

            const createdAt =
              prescription.createdAt ||
              prescription.created_at ||
              prescription.date;

            newAlerts.push({
              id:
                "prescription-" +
                (prescription.id ||
                  prescription._id ||
                  Math.random()),

              type: "prescription",

              icon: "💊",

              title: "Prescription Added",

              message:
                medicine
                  ? `${patientName} has a new prescription: ${medicine}.`
                  : `${patientName} has a new prescription in the healthcare records.`,

              time:
                createdAt
                  ? formatDate(createdAt)
                  : "Prescriptions",
            });
          });
        }
      }
    } catch (error) {
      console.log(
        "Prescription alerts skipped:",
        error.message
      );
    }

    // ===================================================
    // 4. REMOVE DUPLICATES
    // ===================================================

    const uniqueAlerts = newAlerts.filter(
      (alert, index, self) =>
        index ===
        self.findIndex(
          (item) => item.id === alert.id
        )
    );

    // ===================================================
    // SORT ALERTS
    // ===================================================

    uniqueAlerts.sort((a, b) => {
      return String(b.time).localeCompare(
        String(a.time)
      );
    });

    setAlerts(uniqueAlerts);

    setLastUpdated(new Date());

    setLoading(false);
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadAlerts();
  }, []);

  // =====================================================
  // REMOVE SINGLE ALERT
  // =====================================================

  const removeAlert = (id) => {
    setAlerts((previous) =>
      previous.filter(
        (alert) => alert.id !== id
      )
    );
  };

  // =====================================================
  // CLEAR ALL
  // =====================================================

  const clearAll = () => {
    setAlerts([]);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshAlerts = () => {
    loadAlerts();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="smart-alerts-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .smart-alerts-page {
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
              rgba(0, 180, 216, 0.12),
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

        .alerts-container {
          max-width: 1100px;

          margin: auto;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .alerts-header {
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
            0 15px 40px
            rgba(0, 100, 150, 0.20);

          margin-bottom: 25px;
        }

        .alerts-header::after {
          content: "🔔";

          position: absolute;

          right: 45px;

          top: 20px;

          font-size: 90px;

          opacity: 0.12;
        }

        .alerts-header-content {
          position: relative;

          z-index: 2;
        }

        .alerts-header h1 {
          margin: 0;

          font-size: 34px;

          font-weight: 850;
        }

        .alerts-header p {
          margin: 10px 0 0;

          max-width: 800px;

          color:
            rgba(255,255,255,0.88);

          font-size: 15px;

          line-height: 1.6;
        }

        /* ==========================================
           TOOLBAR
        ========================================== */

        .alerts-toolbar {
          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 15px;

          flex-wrap: wrap;

          background: white;

          padding: 18px 22px;

          border-radius: 16px;

          border:
            1px solid #dcecf3;

          box-shadow:
            0 7px 22px
            rgba(30,80,100,0.08);

          margin-bottom: 20px;
        }

        .toolbar-left {
          display: flex;

          align-items: center;

          gap: 15px;

          flex-wrap: wrap;
        }

        .alert-count {
          color: #17445b;

          font-size: 16px;

          font-weight: 800;
        }

        .last-updated {
          color: #90a4ae;

          font-size: 12px;
        }

        .toolbar-buttons {
          display: flex;

          gap: 9px;
        }

        .toolbar-button {
          border: none;

          padding: 10px 15px;

          border-radius: 9px;

          font-weight: 750;

          cursor: pointer;

          transition: 0.2s;
        }

        .refresh-button {
          background: #e0f7fa;

          color: #006064;
        }

        .refresh-button:hover {
          background: #b2ebf2;

          transform:
            translateY(-2px);
        }

        .clear-button {
          background: #f1f5f9;

          color: #475569;
        }

        .clear-button:hover {
          background: #e2e8f0;

          transform:
            translateY(-2px);
        }

        /* ==========================================
           ALERT CARD
        ========================================== */

        .alert-card {
          display: flex;

          align-items: flex-start;

          gap: 18px;

          padding: 22px;

          background: white;

          border-radius: 18px;

          margin-bottom: 15px;

          border:
            1px solid #e1eef4;

          box-shadow:
            0 7px 22px
            rgba(30,80,100,0.07);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .alert-card:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 12px 28px
            rgba(30,80,100,0.12);
        }

        .alert-icon {
          width: 55px;

          height: 55px;

          min-width: 55px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 15px;

          font-size: 27px;

          background: #eef8ff;
        }

        .alert-content {
          flex: 1;

          min-width: 0;
        }

        .alert-title {
          margin: 0 0 6px;

          color: #17445b;

          font-size: 17px;

          font-weight: 800;
        }

        .alert-message {
          margin: 0;

          color: #607d8b;

          font-size: 14px;

          line-height: 1.6;
        }

        .alert-time {
          margin-top: 8px;

          font-size: 12px;

          color: #90a4ae;

          font-weight: 650;
        }

        .remove-alert {
          border: none;

          background: transparent;

          color: #94a3b8;

          font-size: 18px;

          cursor: pointer;

          padding: 4px 7px;

          border-radius: 6px;
        }

        .remove-alert:hover {
          background: #f1f5f9;

          color: #ef4444;
        }

        /* ==========================================
           ALERT TYPES
        ========================================== */

        .alert-card.critical {
          border-left:
            5px solid #dc2626;
        }

        .alert-card.critical .alert-icon {
          background: #fee2e2;
        }

        .alert-card.warning {
          border-left:
            5px solid #f59e0b;
        }

        .alert-card.warning .alert-icon {
          background: #fef3c7;
        }

        .alert-card.appointment {
          border-left:
            5px solid #0891b2;
        }

        .alert-card.appointment .alert-icon {
          background: #cffafe;
        }

        .alert-card.prescription {
          border-left:
            5px solid #7c3aed;
        }

        .alert-card.prescription .alert-icon {
          background: #ede9fe;
        }

        .alert-card.prediction {
          border-left:
            5px solid #2563eb;
        }

        .alert-card.prediction .alert-icon {
          background: #dbeafe;
        }

        /* ==========================================
           EMPTY
        ========================================== */

        .empty-alerts {
          text-align: center;

          padding: 65px 20px;

          background: white;

          border-radius: 20px;

          border:
            1px solid #e1eef4;

          box-shadow:
            0 8px 25px
            rgba(30,80,100,0.07);
        }

        .empty-icon {
          font-size: 55px;

          margin-bottom: 15px;
        }

        .empty-alerts h2 {
          margin: 0 0 8px;

          color: #17445b;
        }

        .empty-alerts p {
          margin: 0;

          color: #78909c;
        }

        /* ==========================================
           LOADING
        ========================================== */

        .loading-alerts {
          text-align: center;

          padding: 70px;

          color: #607d8b;

          font-weight: 700;
        }

        .spinner {
          font-size: 35px;

          margin-bottom: 10px;

          animation:
            pulse 1.2s infinite;
        }

        @keyframes pulse {

          0% {
            transform: scale(1);

            opacity: 0.6;
          }

          50% {
            transform: scale(1.15);

            opacity: 1;
          }

          100% {
            transform: scale(1);

            opacity: 0.6;
          }

        }

        /* ==========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 650px) {

          .smart-alerts-page {
            padding:
              20px 12px 40px;
          }

          .alerts-header {
            padding:
              25px 20px;
          }

          .alerts-header h1 {
            font-size: 27px;
          }

          .alerts-header::after {
            right: 10px;

            font-size: 60px;
          }

          .alert-card {
            padding: 17px;

            gap: 12px;
          }

          .alert-icon {
            width: 45px;

            height: 45px;

            min-width: 45px;

            font-size: 22px;
          }

          .toolbar-buttons {
            width: 100%;
          }

          .toolbar-button {
            flex: 1;
          }

        }

      `}</style>

      <div className="alerts-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="alerts-header">

          <div className="alerts-header-content">

            <h1>
              🔔 Smart Healthcare Alerts
            </h1>

            <p>
              Stay informed about AI predictions,
              appointments, prescriptions and
              important healthcare events.
            </p>

          </div>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="alerts-toolbar">

          <div className="toolbar-left">

            <div className="alert-count">
              🔔 {alerts.length} Active Alert
              {alerts.length !== 1
                ? "s"
                : ""}
            </div>

            {lastUpdated && (
              <div className="last-updated">
                Last updated:{" "}
                {formatDate(lastUpdated)}
              </div>
            )}

          </div>

          <div className="toolbar-buttons">

            <button
              className="toolbar-button refresh-button"
              onClick={refreshAlerts}
              disabled={loading}
            >
              🔄 Refresh
            </button>

            {alerts.length > 0 && (
              <button
                className="toolbar-button clear-button"
                onClick={clearAll}
              >
                🧹 Clear All
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            ALERT CONTENT
        ================================================= */}

        {loading ? (

          <div className="loading-alerts">

            <div className="spinner">
              🔄
            </div>

            Loading healthcare alerts...

          </div>

        ) : alerts.length === 0 ? (

          <div className="empty-alerts">

            <div className="empty-icon">
              ✅
            </div>

            <h2>
              All Clear!
            </h2>

            <p>
              There are currently no healthcare alerts.
            </p>

          </div>

        ) : (

          alerts.map((alert) => (

            <div
              key={alert.id}
              className={
                "alert-card " +
                alert.type
              }
            >

              <div className="alert-icon">
                {alert.icon}
              </div>

              <div className="alert-content">

                <h3 className="alert-title">
                  {alert.title}
                </h3>

                <p className="alert-message">
                  {alert.message}
                </p>

                <div className="alert-time">
                  🕒 {alert.time}
                </div>

              </div>

              <button
                className="remove-alert"
                onClick={() =>
                  removeAlert(alert.id)
                }
                title="Dismiss alert"
              >
                ✕
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default SmartAlerts;