import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function DiseaseAnalytics() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD PREDICTION HISTORY
  // =========================================

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://ai-healthcare-backend-5dud.onrender.com/api/predictions"
      );

      if (!response.ok) {
        throw new Error("Failed to load prediction data.");
      }

      const data = await response.json();

      console.log("Analytics prediction data:", data);

      // Support both direct array and { predictions: [] }
      if (Array.isArray(data)) {
        setPredictions(data);
      } else if (Array.isArray(data.predictions)) {
        setPredictions(data.predictions);
      } else if (Array.isArray(data.data)) {
        setPredictions(data.data);
      } else {
        setPredictions([]);
      }
    } catch (err) {
      console.error("Analytics Error:", err);

      setError(
        err.message ||
          "Unable to load prediction analytics."
      );

      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // GET DISEASE NAME
  // =========================================

  const getDiseaseName = (item) => {
    return (
      item?.disease ||
      item?.predictedDisease ||
      item?.predicted_disease ||
      item?.prediction ||
      item?.result ||
      "Unknown"
    );
  };

  // =========================================
  // DISEASE DATA
  // =========================================

  const diseaseData = useMemo(() => {
    const counts = {};

    predictions.forEach((item) => {
      const disease = getDiseaseName(item);

      counts[disease] =
        (counts[disease] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [predictions]);

  // =========================================
  // TREND DATA
  // =========================================

  const trendData = useMemo(() => {
    const grouped = {};

    predictions.forEach((item) => {
      const rawDate =
        item.created_at ||
        item.createdAt ||
        item.date ||
        item.predictedAt;

      let date = "Unknown";

      if (rawDate) {
        const parsedDate = new Date(rawDate);

        if (!Number.isNaN(parsedDate.getTime())) {
          date = parsedDate.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
            }
          );
        }
      }

      grouped[date] =
        (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(
      ([date, count]) => ({
        date,
        count,
      })
    );
  }, [predictions]);

  // =========================================
  // STATISTICS
  // =========================================

  const totalPredictions =
    predictions.length;

  const mostCommonDisease =
    diseaseData.length > 0
      ? diseaseData[0].name
      : "No data";

  const differentDiseases =
    diseaseData.length;

  // =========================================
  // COLORS
  // =========================================

  const chartColors = [
    "#0077b6",
    "#00b4d8",
    "#2e9d4d",
    "#ef8d16",
    "#6a1b9a",
    "#e53935",
    "#00897b",
    "#3949ab",
    "#f4511e",
    "#546e7a",
  ];

  // =========================================
  // UI
  // =========================================

  return (
    <div className="analytics-page">
      <style>{`

        * {
          box-sizing: border-box;
        }

        .analytics-page {
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
              rgba(0,188,212,0.13),
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
              #f9fcff
            );
        }

        .analytics-container {
          max-width: 1350px;
          margin: auto;
        }

        /* =========================
           HEADER
        ========================= */

        .analytics-header {
          padding: 35px;

          border-radius: 25px;

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
            rgba(0,70,100,0.20);

          margin-bottom: 25px;
        }

        .analytics-header h1 {
          margin: 0;

          font-size: 38px;

          font-weight: 850;
        }

        .analytics-header p {
          margin: 10px 0 0;

          max-width: 850px;

          color:
            rgba(255,255,255,0.86);

          line-height: 1.6;

          font-size: 15px;
        }

        /* =========================
           STATISTICS
        ========================= */

        .analytics-stats {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 20px;

          margin-bottom: 25px;
        }

        .analytics-stat {
          padding: 25px;

          border-radius: 20px;

          background: white;

          border:
            1px solid #e1edf3;

          box-shadow:
            0 8px 25px
            rgba(30,80,100,0.08);
        }

        .analytics-stat-icon {
          font-size: 28px;

          margin-bottom: 12px;
        }

        .analytics-stat-title {
          color: #78909c;

          font-size: 13px;

          font-weight: 750;

          text-transform: uppercase;

          letter-spacing: 0.5px;
        }

        .analytics-stat-value {
          margin-top: 7px;

          color: #075985;

          font-size: 30px;

          font-weight: 850;
        }

        /* =========================
           CHART GRID
        ========================= */

        .chart-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 22px;
        }

        .chart-card {
          min-width: 0;

          padding: 25px;

          border-radius: 20px;

          background: white;

          border:
            1px solid #e1edf3;

          box-shadow:
            0 8px 25px
            rgba(30,80,100,0.08);
        }

        .chart-card.full-width {
          grid-column:
            1 / -1;
        }

        .chart-title {
          margin: 0;

          color: #17445b;

          font-size: 19px;

          font-weight: 800;
        }

        .chart-subtitle {
          margin: 6px 0 20px;

          color: #78909c;

          font-size: 13px;
        }

        .chart-container {
          width: 100%;

          height: 350px;
        }

        /* =========================
           EMPTY
        ========================= */

        .empty-box {
          padding: 60px 20px;

          text-align: center;

          color: #78909c;
        }

        .empty-icon {
          font-size: 50px;

          margin-bottom: 12px;
        }

        .empty-title {
          color: #315363;

          font-size: 19px;

          font-weight: 800;
        }

        /* =========================
           ERROR
        ========================= */

        .error-box {
          margin-bottom: 25px;

          padding: 18px;

          border-radius: 12px;

          background: #fff1f2;

          border:
            1px solid #fecdd3;

          color: #b42318;

          font-weight: 650;
        }

        /* =========================
           REFRESH
        ========================= */

        .refresh-button {
          margin-top: 18px;

          padding: 11px 18px;

          border: none;

          border-radius: 9px;

          background: white;

          color: #075985;

          font-weight: 800;

          cursor: pointer;
        }

        .refresh-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 6px 15px
            rgba(0,0,0,0.15);
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 900px) {

          .analytics-stats {
            grid-template-columns:
              1fr 1fr;
          }

          .chart-grid {
            grid-template-columns:
              1fr;
          }

          .chart-card.full-width {
            grid-column: auto;
          }
        }

        @media (max-width: 600px) {

          .analytics-page {
            padding:
              20px 12px 40px;
          }

          .analytics-header {
            padding: 25px 20px;
          }

          .analytics-header h1 {
            font-size: 29px;
          }

          .analytics-stats {
            grid-template-columns:
              1fr;
          }

          .chart-card {
            padding: 18px;
          }

          .chart-container {
            height: 300px;
          }
        }

      `}</style>

      <div className="analytics-container">

        {/* =========================
            HEADER
        ========================= */}

        <section className="analytics-header">

          <h1>
            📊 Disease Analytics
          </h1>

          <p>
            Analyze AI disease prediction history
            using interactive charts and statistics.
            This dashboard provides a visual overview
            of predicted diseases and prediction trends.
          </p>

          <button
            className="refresh-button"
            onClick={fetchPredictions}
          >
            🔄 Refresh Analytics
          </button>

        </section>

        {/* =========================
            ERROR
        ========================= */}

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

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="analytics-stats">

          <div className="analytics-stat">

            <div className="analytics-stat-icon">
              🤖
            </div>

            <div className="analytics-stat-title">
              Total Predictions
            </div>

            <div className="analytics-stat-value">
              {loading
                ? "..."
                : totalPredictions}
            </div>

          </div>

          <div className="analytics-stat">

            <div className="analytics-stat-icon">
              🦠
            </div>

            <div className="analytics-stat-title">
              Different Diseases
            </div>

            <div className="analytics-stat-value">
              {loading
                ? "..."
                : differentDiseases}
            </div>

          </div>

          <div className="analytics-stat">

            <div className="analytics-stat-icon">
              🏆
            </div>

            <div className="analytics-stat-title">
              Most Predicted Disease
            </div>

            <div
              className="analytics-stat-value"
              style={{
                fontSize:
                  mostCommonDisease.length > 18
                    ? "20px"
                    : "30px",
              }}
            >
              {loading
                ? "..."
                : mostCommonDisease}
            </div>

          </div>

        </div>

        {/* =========================
            CHARTS
        ========================= */}

        {loading ? (

          <div className="chart-card">

            <div className="empty-box">

              <div className="empty-icon">
                ⏳
              </div>

              <div className="empty-title">
                Loading analytics...
              </div>

            </div>

          </div>

        ) : diseaseData.length === 0 ? (

          <div className="chart-card">

            <div className="empty-box">

              <div className="empty-icon">
                📊
              </div>

              <div className="empty-title">
                No prediction data available
              </div>

              <p>
                Make some AI disease predictions
                first. Your analytics will appear
                here automatically.
              </p>

            </div>

          </div>

        ) : (

          <div className="chart-grid">

            {/* =========================
                PIE CHART
            ========================= */}

            <section className="chart-card">

              <h2 className="chart-title">
                🍩 Disease Distribution
              </h2>

              <p className="chart-subtitle">
                Percentage of predictions for each
                disease.
              </p>

              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={diseaseData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={115}
                      innerRadius={55}
                      paddingAngle={3}
                      label
                    >

                      {diseaseData.map(
                        (entry, index) => (

                          <Cell
                            key={
                              `cell-${index}`
                            }
                            fill={
                              chartColors[
                                index %
                                  chartColors.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* =========================
                BAR CHART
            ========================= */}

            <section className="chart-card">

              <h2 className="chart-title">
                📊 Predictions by Disease
              </h2>

              <p className="chart-subtitle">
                Number of times each disease was
                predicted.
              </p>

              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={diseaseData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 50,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="name"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      height={80}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      name="Predictions"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* =========================
                LINE CHART
            ========================= */}

            <section
              className="chart-card full-width"
            >

              <h2 className="chart-title">
                📈 Prediction Trend
              </h2>

              <p className="chart-subtitle">
                Number of AI predictions recorded
                over time.
              </p>

              {trendData.length > 0 &&
              trendData[0].date !== "Unknown" ? (

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart
                      data={trendData}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="date"
                      />

                      <YAxis
                        allowDecimals={false}
                      />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Predictions"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                        }}
                        activeDot={{
                          r: 7,
                        }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              ) : (

                <div className="empty-box">

                  <div className="empty-icon">
                    📅
                  </div>

                  <div className="empty-title">
                    Prediction dates are not
                    available
                  </div>

                  <p>
                    The disease charts are available,
                    but the prediction records do not
                    contain a usable date field.
                  </p>

                </div>

              )}

            </section>

          </div>

        )}

      </div>

    </div>
  );
}

export default DiseaseAnalytics;