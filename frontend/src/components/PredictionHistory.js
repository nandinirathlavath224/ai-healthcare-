import React, { useEffect, useState } from "react";

function PredictionHistory() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PREDICTION HISTORY
  // ==========================================

  useEffect(() => {
    loadPredictionHistory();
  }, []);

  const loadPredictionHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://ai-healthcare-backend-5dud.onrender.com/api/predictions"
      );

      const text = await response.text();

      let data = [];

      try {
        data = text ? JSON.parse(text) : [];
      } catch (parseError) {
        throw new Error(
          "Invalid response received from backend."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to load prediction history."
        );
      }

      if (Array.isArray(data)) {
        setPredictions(data);
      } else {
        setPredictions([]);
      }
    } catch (err) {
      console.error(
        "Prediction history error:",
        err
      );

      setError(
        err.message ||
          "Unable to load prediction history."
      );

      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT DATE + TIME
  // ==========================================

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="prediction-history-page">
      <style>{`

        * {
          box-sizing: border-box;
        }

        .prediction-history-page {
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

        .history-container {
          max-width: 1250px;
          margin: 0 auto;
        }

        /* =========================
           HEADER
        ========================= */

        .history-header {
          padding: 35px;

          border-radius: 24px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #071e3d,
              #075985,
              #00a8c6
            );

          box-shadow:
            0 15px 40px
            rgba(0, 70, 100, 0.20);

          margin-bottom: 25px;
        }

        .history-header h1 {
          margin: 0;

          font-size: 34px;

          font-weight: 850;
        }

        .history-header p {
          margin: 10px 0 0;

          color:
            rgba(255,255,255,0.88);

          font-size: 15px;

          line-height: 1.6;
        }

        /* =========================
           TOOLBAR
        ========================= */

        .history-toolbar {
          display: flex;

          justify-content:
            space-between;

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

        .history-count {
          color: #17445b;

          font-size: 16px;

          font-weight: 800;
        }

        .refresh-button {
          border: none;

          padding: 10px 17px;

          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00a8c6
            );

          color: white;

          font-weight: 750;

          cursor: pointer;

          transition: 0.2s;
        }

        .refresh-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 7px 15px
            rgba(0,119,182,0.22);
        }

        /* =========================
           TABLE CARD
        ========================= */

        .history-card {
          background: white;

          border-radius: 20px;

          border:
            1px solid #e0edf4;

          box-shadow:
            0 10px 30px
            rgba(30,80,100,0.08);

          overflow: hidden;
        }

        .table-wrapper {
          width: 100%;

          overflow-x: auto;
        }

        table {
          width: 100%;

          border-collapse:
            collapse;

          min-width: 900px;
        }

        thead {
          background:
            linear-gradient(
              135deg,
              #075985,
              #0077b6
            );
        }

        th {
          padding: 17px 15px;

          text-align: left;

          color: white;

          font-size: 13px;

          font-weight: 800;

          white-space: nowrap;
        }

        td {
          padding: 17px 15px;

          border-bottom:
            1px solid #edf2f5;

          color: #496572;

          font-size: 13px;

          vertical-align: middle;
        }

        tbody tr {
          transition:
            background 0.2s;
        }

        tbody tr:hover {
          background:
            #f6fbfd;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        /* =========================
           ID
        ========================= */

        .id-badge {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          min-width: 36px;

          padding: 6px 9px;

          border-radius: 8px;

          background: #e8f5fb;

          color: #075985;

          font-weight: 800;
        }

        /* =========================
           PATIENT
        ========================= */

        .patient-name {
          color: #17445b;

          font-weight: 800;
        }

        /* =========================
           DISEASE
        ========================= */

        .disease-badge {
          display: inline-block;

          padding: 7px 12px;

          border-radius: 20px;

          background: #ecfdf3;

          color: #166534;

          font-weight: 750;

          white-space: nowrap;
        }

        /* =========================
           MODEL
        ========================= */

        .model-badge {
          display: inline-block;

          padding: 7px 11px;

          border-radius: 9px;

          background: #f3e8ff;

          color: #6b21a8;

          font-weight: 700;

          white-space: nowrap;
        }

        /* =========================
           DATE
        ========================= */

        .date-text {
          color: #526b77;

          white-space: nowrap;
        }

        .created-text {
          color: #607d8b;

          white-space: nowrap;
        }

        /* =========================
           EMPTY
        ========================= */

        .empty-history {
          padding: 70px 20px;

          text-align: center;
        }

        .empty-icon {
          font-size: 55px;

          margin-bottom: 15px;
        }

        .empty-history h2 {
          margin: 0 0 8px;

          color: #17445b;
        }

        .empty-history p {
          margin: 0;

          color: #78909c;
        }

        /* =========================
           ERROR
        ========================= */

        .error-box {
          margin-bottom: 20px;

          padding: 17px;

          border-radius: 12px;

          background: #fff1f2;

          border:
            1px solid #fecdd3;

          color: #b42318;

          font-weight: 650;

          line-height: 1.5;
        }

        /* =========================
           LOADING
        ========================= */

        .loading-box {
          padding: 70px 20px;

          text-align: center;

          color: #607d8b;

          font-weight: 700;
        }

        .loading-icon {
          font-size: 35px;

          margin-bottom: 10px;

          animation:
            spin 1.2s linear infinite;
        }

        @keyframes spin {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 650px) {

          .prediction-history-page {
            padding:
              20px 12px 40px;
          }

          .history-header {
            padding: 25px 20px;
          }

          .history-header h1 {
            font-size: 27px;
          }

          .history-toolbar {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .refresh-button {
            width: 100%;
          }

        }

      `}</style>

      <div className="history-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <section className="history-header">

          <h1>
            📊 Prediction History
          </h1>

          <p>
            View the complete history of AI disease
            predictions, including patient information,
            prediction results, model used, and
            prediction timestamps.
          </p>

        </section>

        {/* ======================================
            TOOLBAR
        ====================================== */}

        <div className="history-toolbar">

          <div className="history-count">

            📋 {predictions.length} Prediction
            {predictions.length !== 1 ? "s" : ""}

          </div>

          <button
            className="refresh-button"
            onClick={loadPredictionHistory}
            disabled={loading}
          >
            🔄 Refresh
          </button>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="error-box">

            ❌ {error}

            <br />

            <small>
              Make sure your Node.js backend is
              running on port 5000.
            </small>

          </div>

        )}

        {/* ======================================
            HISTORY TABLE
        ====================================== */}

        <section className="history-card">

          {loading ? (

            <div className="loading-box">

              <div className="loading-icon">
                🔄
              </div>

              Loading prediction history...

            </div>

          ) : predictions.length === 0 ? (

            <div className="empty-history">

              <div className="empty-icon">
                📭
              </div>

              <h2>
                No Prediction History
              </h2>

              <p>
                No AI disease predictions have been
                recorded yet.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Patient Name
                    </th>

                    <th>
                      Predicted Disease
                    </th>

                    <th>
                      Model Used
                    </th>

                    <th>
                      Prediction Date
                    </th>

                    <th>
                      Created At
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {predictions.map(
                    (prediction, index) => (

                      <tr
                        key={
                          prediction.id ||
                          index
                        }
                      >

                        {/* ID */}

                        <td>

                          <span className="id-badge">

                            {prediction.id || "-"}

                          </span>

                        </td>

                        {/* PATIENT NAME */}

                        <td>

                          <span className="patient-name">

                            {prediction.patientName ||
                              prediction.patient_name ||
                              "Unknown Patient"}

                          </span>

                        </td>

                        {/* DISEASE */}

                        <td>

                          <span className="disease-badge">

                            {prediction.predictedDisease ||
                              prediction.predicted_disease ||
                              prediction.disease ||
                              "-"}

                          </span>

                        </td>

                        {/* MODEL */}

                        <td>

                          <span className="model-badge">

                            {prediction.modelUsed ||
                              prediction.model_used ||
                              "Random Forest"}

                          </span>

                        </td>

                        {/* PREDICTION DATE */}

                        <td>

                          <span className="date-text">

                            {formatDate(
                              prediction.predictionDate ||
                              prediction.prediction_date
                            )}

                          </span>

                        </td>

                        {/* CREATED AT */}

                        <td>

                          <span className="created-text">

                            {formatDateTime(
                              prediction.createdAt ||
                              prediction.created_at
                            )}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default PredictionHistory;