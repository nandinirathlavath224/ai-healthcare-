import React, { useEffect, useMemo, useState } from "react";

function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // ==============================
  // FETCH DATA
  // ==============================
  const getData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [prescriptionResponse, patientResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/prescriptions"),
          fetch("http://localhost:5000/api/patients"),
        ]);

      if (!prescriptionResponse.ok || !patientResponse.ok) {
        throw new Error("Failed to load data");
      }

      const prescriptionData =
        await prescriptionResponse.json();

      const patientData =
        await patientResponse.json();

      setPrescriptions(
        Array.isArray(prescriptionData)
          ? prescriptionData
          : []
      );

      setPatients(
        Array.isArray(patientData)
          ? patientData
          : []
      );
    } catch (error) {
      console.error(
        "Error loading prescription data:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // ==============================
  // FIND PATIENT NAME
  // ==============================
  const getPatientName = (patientId) => {
    const patient = patients.find(
      (p) => Number(p.id) === Number(patientId)
    );

    return patient
      ? patient.name
      : `Patient ID: ${patientId}`;
  };

  // ==============================
  // FILTER PRESCRIPTIONS
  // ==============================
  const filteredPrescriptions = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return prescriptions;
    }

    return prescriptions.filter((item) => {
      const patientName =
        getPatientName(item.patient_id);

      return (
        String(item.id || "")
          .toLowerCase()
          .includes(search) ||

        String(item.medicine || "")
          .toLowerCase()
          .includes(search) ||

        String(item.disease || "")
          .toLowerCase()
          .includes(search) ||

        String(item.doctor_name || "")
          .toLowerCase()
          .includes(search) ||

        String(patientName || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [prescriptions, patients, searchTerm]);

  // ==============================
  // UNIQUE PATIENTS
  // ==============================
  const uniquePatients = new Set(
    prescriptions.map(
      (item) => item.patient_id
    )
  ).size;

  // ==============================
  // UNIQUE DIAGNOSES
  // ==============================
  const uniqueDiseases = new Set(
    prescriptions
      .map((item) => item.disease)
      .filter(Boolean)
  ).size;

  // ==============================
  // DATE FORMAT
  // ==============================
  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==============================
  // LOADING SCREEN
  // ==============================
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>
            💊
          </div>

          <div style={styles.spinner}></div>

          <h2 style={styles.loadingTitle}>
            Loading Prescription Center
          </h2>

          <p style={styles.loadingText}>
            Preparing your healthcare records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* =================================
          HERO HEADER
      ================================= */}
      <div style={styles.hero}>

        <div style={styles.heroLeft}>

          <div style={styles.heroIcon}>
            💊
          </div>

          <div>
            <div style={styles.eyebrow}>
              AI HEALTHCARE • MEDICATION CENTER
            </div>

            <h1 style={styles.title}>
              Prescription Hub
            </h1>

            <p style={styles.subtitle}>
              Manage medications, diagnoses and
              treatment instructions in one place.
            </p>
          </div>

        </div>

        <button
          onClick={() => getData(true)}
          style={styles.refreshButton}
          disabled={refreshing}
        >
          <span
            style={{
              display: "inline-block",
              marginRight: "7px",
              animation: refreshing
                ? "spin 1s linear infinite"
                : "none",
            }}
          >
            ↻
          </span>

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* =================================
          STATISTICS
      ================================= */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background: "#e9f5ff",
            }}
          >
            💊
          </div>

          <div>
            <div style={styles.statLabel}>
              Total Prescriptions
            </div>

            <div style={styles.statNumber}>
              {prescriptions.length}
            </div>
          </div>
        </div>


        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background: "#eafaf1",
            }}
          >
            👥
          </div>

          <div>
            <div style={styles.statLabel}>
              Patients Covered
            </div>

            <div style={styles.statNumber}>
              {uniquePatients}
            </div>
          </div>
        </div>


        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background: "#fff4e5",
            }}
          >
            🩺
          </div>

          <div>
            <div style={styles.statLabel}>
              Diagnoses
            </div>

            <div style={styles.statNumber}>
              {uniqueDiseases}
            </div>
          </div>
        </div>


        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              background: "#f2edff",
            }}
          >
            🛡️
          </div>

          <div>
            <div style={styles.statLabel}>
              Status
            </div>

            <div
              style={{
                ...styles.statNumber,
                fontSize: "18px",
                color: "#18864b",
              }}
            >
              Active
            </div>
          </div>
        </div>

      </div>


      {/* =================================
          SEARCH AREA
      ================================= */}
      <div style={styles.toolbar}>

        <div style={styles.searchContainer}>

          <span style={styles.searchIcon}>
            🔎
          </span>

          <input
            type="text"
            placeholder="Search patient, doctor, medicine or diagnosis..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={styles.searchInput}
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={styles.clearSearch}
            >
              ✕
            </button>
          )}

        </div>

        <div style={styles.resultCount}>
          Showing{" "}
          <strong>
            {filteredPrescriptions.length}
          </strong>{" "}
          prescriptions
        </div>

      </div>


      {/* =================================
          EMPTY STATE
      ================================= */}
      {prescriptions.length === 0 ? (

        <div style={styles.emptyCard}>

          <div style={styles.emptyIcon}>
            📋
          </div>

          <h2 style={styles.emptyTitle}>
            No Prescriptions Yet
          </h2>

          <p style={styles.emptyText}>
            Prescriptions created by doctors will
            appear here automatically.
          </p>

        </div>

      ) : filteredPrescriptions.length === 0 ? (

        <div style={styles.emptyCard}>

          <div style={styles.emptyIcon}>
            🔍
          </div>

          <h2 style={styles.emptyTitle}>
            No Matching Prescriptions
          </h2>

          <p style={styles.emptyText}>
            Try searching with another patient,
            medicine, doctor or diagnosis.
          </p>

          <button
            onClick={() => setSearchTerm("")}
            style={styles.resetButton}
          >
            Clear Search
          </button>

        </div>

      ) : (

        /* =================================
           PRESCRIPTION GRID
        ================================= */
        <div style={styles.grid}>

          {filteredPrescriptions.map(
            (item, index) => (

              <div
                key={item.id || index}
                style={styles.card}
                className="prescription-card"
              >

                {/* CARD TOP */}
                <div style={styles.cardTop}>

                  <div style={styles.medicineIcon}>
                    💊
                  </div>

                  <div style={styles.cardTitleArea}>

                    <h2 style={styles.medicine}>
                      {item.medicine ||
                        "Medicine Not Available"}
                    </h2>

                    <span
                      style={
                        styles.prescriptionNumber
                      }
                    >
                      Prescription #
                      {item.id}
                    </span>

                  </div>

                  <div style={styles.activeBadge}>
                    <span
                      style={styles.activeDot}
                    ></span>

                    ACTIVE
                  </div>

                </div>


                {/* DIVIDER */}
                <div style={styles.divider}></div>


                {/* PATIENT */}
                <div style={styles.patientBanner}>

                  <div style={styles.avatar}>
                    {getPatientName(
                      item.patient_id
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <div
                      style={styles.smallLabel}
                    >
                      PATIENT
                    </div>

                    <div
                      style={styles.patientName}
                    >
                      {getPatientName(
                        item.patient_id
                      )}
                    </div>

                  </div>

                </div>


                {/* INFORMATION GRID */}
                <div style={styles.infoGrid}>

                  <div style={styles.infoBox}>

                    <div
                      style={styles.infoIcon}
                    >
                      👨‍⚕️
                    </div>

                    <div>

                      <div
                        style={styles.smallLabel}
                      >
                        DOCTOR
                      </div>

                      <div
                        style={styles.infoValue}
                      >
                        {item.doctor_name ||
                          "Not Available"}
                      </div>

                    </div>

                  </div>


                  <div style={styles.infoBox}>

                    <div
                      style={styles.infoIcon}
                    >
                      🩺
                    </div>

                    <div>

                      <div
                        style={styles.smallLabel}
                      >
                        DIAGNOSIS
                      </div>

                      <div
                        style={styles.diagnosis}
                      >
                        {item.disease ||
                          "Not Available"}
                      </div>

                    </div>

                  </div>

                </div>


                {/* MEDICINE DETAILS */}
                <div style={styles.medicineSection}>

                  <div
                    style={styles.sectionHeading}
                  >
                    <span>💊</span>
                    Medication
                  </div>

                  <div
                    style={styles.medicineDetail}
                  >
                    {item.medicine ||
                      "Medicine information unavailable"}
                  </div>

                </div>


                {/* INSTRUCTIONS */}
                <div style={styles.instructions}>

                  <div
                    style={styles.instructionsHeader}
                  >
                    <span>📌</span>

                    <span>
                      Doctor's Instructions
                    </span>
                  </div>

                  <p style={styles.notes}>
                    {item.notes ||
                      "No special instructions provided."}
                  </p>

                </div>


                {/* FOOTER */}
                <div style={styles.cardFooter}>

                  <div>
                    <span
                      style={styles.calendarIcon}
                    >
                      📅
                    </span>

                    {formatDate(
                      item.created_at
                    )}
                  </div>

                  <div>
                    🕐{" "}
                    {formatTime(
                      item.created_at
                    )}
                  </div>

                </div>

              </div>

            )
          )}

        </div>
      )}


      {/* =================================
          FOOTER MESSAGE
      ================================= */}
      <div style={styles.bottomMessage}>

        <span>🔐</span>

        <span>
          Patient prescription information is
          securely managed by AI Healthcare.
        </span>

      </div>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .prescription-card {
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease;
          }

          .prescription-card:hover {
            transform: translateY(-6px);
            box-shadow:
              0 18px 45px rgba(0, 91, 140, 0.14) !important;
          }

          input::placeholder {
            color: #9aa8b3;
          }

          button {
            font-family: inherit;
          }
        `}
      </style>

    </div>
  );
}


// ========================================
// STYLES
// ========================================

const styles = {

  page: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(135deg, #f4f9fc 0%, #eef7fb 50%, #f8fbfd 100%)",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#16232d",
  },


  // HERO
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
    padding: "28px 30px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, #075985 0%, #087f9f 55%, #0b9ab5 100%)",
    color: "white",
    boxShadow:
      "0 15px 40px rgba(4, 105, 137, 0.22)",
    flexWrap: "wrap",
  },


  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },


  heroIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.15)",
    fontSize: "30px",
    border:
      "1px solid rgba(255,255,255,0.2)",
  },


  eyebrow: {
    fontSize: "10px",
    letterSpacing: "2px",
    fontWeight: "700",
    opacity: 0.75,
    marginBottom: "5px",
  },


  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.7px",
  },


  subtitle: {
    margin: "7px 0 0",
    fontSize: "14px",
    opacity: 0.85,
  },


  refreshButton: {
    border: "none",
    background: "white",
    color: "#086b89",
    padding: "12px 19px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 5px 18px rgba(0,0,0,0.12)",
  },


  // STATISTICS
  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },


  statCard: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #e4edf2",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 7px 24px rgba(20,70,90,0.06)",
  },


  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },


  statLabel: {
    color: "#81909b",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },


  statNumber: {
    fontSize: "25px",
    fontWeight: "800",
    marginTop: "3px",
    color: "#17313f",
  },


  // TOOLBAR
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },


  searchContainer: {
    flex: 1,
    minWidth: "280px",
    maxWidth: "700px",
    position: "relative",
  },


  searchIcon: {
    position: "absolute",
    left: "17px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "17px",
  },


  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 45px",
    borderRadius: "15px",
    border: "1px solid #dce8ee",
    outline: "none",
    fontSize: "14px",
    background: "white",
    color: "#20323d",
    boxShadow:
      "0 5px 20px rgba(30,80,100,0.05)",
  },


  clearSearch: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "#edf4f7",
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#607783",
  },


  resultCount: {
    color: "#70838e",
    fontSize: "13px",
  },


  // GRID
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "22px",
  },


  // CARD
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid #e3edf2",
    boxShadow:
      "0 8px 30px rgba(15,67,87,0.08)",
  },


  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },


  medicineIcon: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #e6f7ff, #d9f2f8)",
    fontSize: "23px",
  },


  cardTitleArea: {
    flex: 1,
    minWidth: 0,
  },


  medicine: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
    color: "#12617e",
    wordBreak: "break-word",
  },


  prescriptionNumber: {
    display: "block",
    marginTop: "4px",
    color: "#92a0a8",
    fontSize: "11px",
    fontWeight: "600",
  },


  activeBadge: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 9px",
    borderRadius: "20px",
    background: "#e9f8ef",
    color: "#23804c",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },


  activeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#28a85a",
  },


  divider: {
    height: "1px",
    background: "#edf2f5",
    margin: "19px 0",
  },


  // PATIENT
  patientBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg, #f4fbfd, #eef8fb)",
    marginBottom: "16px",
  },


  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #087e9d, #20a6bd)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "17px",
  },


  smallLabel: {
    fontSize: "9px",
    letterSpacing: "1px",
    fontWeight: "800",
    color: "#8a9ba5",
    marginBottom: "3px",
  },


  patientName: {
    fontWeight: "750",
    fontSize: "15px",
    color: "#233b47",
  },


  // INFO
  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "17px",
  },


  infoBox: {
    padding: "13px",
    border: "1px solid #edf1f3",
    borderRadius: "14px",
    display: "flex",
    gap: "9px",
    alignItems: "flex-start",
  },


  infoIcon: {
    fontSize: "18px",
  },


  infoValue: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#324955",
    wordBreak: "break-word",
  },


  diagnosis: {
    fontSize: "13px",
    fontWeight: "750",
    color: "#c45b32",
    wordBreak: "break-word",
  },


  // MEDICINE
  medicineSection: {
    marginBottom: "14px",
    padding: "14px",
    borderRadius: "14px",
    background: "#f8fbfc",
  },


  sectionHeading: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "800",
    color: "#49626e",
    marginBottom: "8px",
  },


  medicineDetail: {
    fontSize: "14px",
    color: "#176781",
    fontWeight: "750",
  },


  // INSTRUCTIONS
  instructions: {
    padding: "15px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg, #fffaf0, #fff7e5)",
    border:
      "1px solid #f6ead0",
  },


  instructionsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12px",
    fontWeight: "800",
    color: "#8a6725",
  },


  notes: {
    margin: "9px 0 0",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#65583d",
  },


  // FOOTER
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "18px",
    paddingTop: "13px",
    borderTop: "1px solid #edf1f3",
    color: "#8b9aa2",
    fontSize: "11px",
    fontWeight: "600",
  },


  calendarIcon: {
    marginRight: "5px",
  },


  // EMPTY
  emptyCard: {
    background: "white",
    borderRadius: "22px",
    padding: "70px 30px",
    textAlign: "center",
    border: "1px solid #e3edf2",
    boxShadow:
      "0 8px 30px rgba(20,70,90,0.06)",
  },


  emptyIcon: {
    width: "75px",
    height: "75px",
    borderRadius: "22px",
    background: "#eef8fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    margin: "0 auto 18px",
  },


  emptyTitle: {
    margin: 0,
    color: "#284451",
  },


  emptyText: {
    color: "#81919a",
    maxWidth: "450px",
    margin:
      "10px auto 20px",
    lineHeight: "1.6",
  },


  resetButton: {
    border: "none",
    padding: "11px 18px",
    borderRadius: "10px",
    background: "#087d9b",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },


  // LOADING
  loadingCard: {
    background: "white",
    borderRadius: "24px",
    padding: "70px 30px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "100px auto",
    boxShadow:
      "0 15px 40px rgba(20,70,90,0.08)",
  },


  loadingIcon: {
    fontSize: "45px",
    marginBottom: "18px",
  },


  spinner: {
    width: "30px",
    height: "30px",
    border:
      "3px solid #dceff4",
    borderTop:
      "3px solid #087d9b",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation:
      "spin 1s linear infinite",
  },


  loadingTitle: {
    margin: 0,
    color: "#294551",
  },


  loadingText: {
    color: "#83939c",
  },


  bottomMessage: {
    marginTop: "25px",
    padding: "15px",
    textAlign: "center",
    color: "#8a9aa3",
    fontSize: "11px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
  },

};

export default PrescriptionList;