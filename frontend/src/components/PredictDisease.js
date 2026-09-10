import React, { useState } from "react";

function PredictDisease({ setPage }) {
  // =========================================
  // SYMPTOMS
  // =========================================

  const symptomsList = [
    "fever",
    "headache",
    "fatigue",
    "frequent_urination",
    "weight_loss",
    "chest_pain",
    "dizziness",
    "chills",
    "vomiting",
    "abdominal_pain",
    "joint_pain",
    "rash",
    "cough",
    "breathing_problem",
  ];

  const symptomLabels = {
    fever: "Fever",
    headache: "Headache",
    fatigue: "Fatigue",
    frequent_urination: "Frequent Urination",
    weight_loss: "Weight Loss",
    chest_pain: "Chest Pain",
    dizziness: "Dizziness",
    chills: "Chills",
    vomiting: "Vomiting",
    abdominal_pain: "Abdominal Pain",
    joint_pain: "Joint Pain",
    rash: "Skin Rash",
    cough: "Cough",
    breathing_problem: "Breathing Problem",
  };

  // =========================================
  // PATIENT INFORMATION
  // =========================================

  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  // =========================================
  // SYMPTOM STATE
  // =========================================

  const [symptoms, setSymptoms] = useState(() => {
    const initial = {};

    symptomsList.forEach((symptom) => {
      initial[symptom] = false;
    });

    return initial;
  });

  // =========================================
  // RESULT STATE
  // =========================================

  const [prediction, setPrediction] = useState(null);

  const [doctorRecommendation, setDoctorRecommendation] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================================
  // HANDLE SYMPTOM
  // =========================================

  const handleSymptomChange = (symptom) => {
    setSymptoms((previous) => ({
      ...previous,
      [symptom]: !previous[symptom],
    }));
  };

  // =========================================
  // CLEAR
  // =========================================

  const clearSymptoms = () => {
    const cleared = {};

    symptomsList.forEach((symptom) => {
      cleared[symptom] = false;
    });

    setSymptoms(cleared);
    setPrediction(null);
    setDoctorRecommendation(null);
    setError("");
  };

  // =========================================
  // SELECTED SYMPTOMS
  // =========================================

  const selectedSymptoms = symptomsList.filter(
    (symptom) => symptoms[symptom]
  );

  // =========================================
  // DOCTOR RECOMMENDATION
  // =========================================

  const getDoctorRecommendation = (disease) => {
    const diseaseText = String(disease || "")
      .toLowerCase()
      .trim();

    const recommendations = [
      {
        keywords: ["diabetes"],
        doctor: "Endocrinologist",
        icon: "🩺",
        description:
          "Specialist in diabetes, hormones and metabolic disorders.",
      },
      {
        keywords: [
          "heart disease",
          "heart",
          "cardiac",
          "hypertension",
          "high blood pressure",
        ],
        doctor: "Cardiologist",
        icon: "❤️",
        description:
          "Specialist in heart and cardiovascular conditions.",
      },
      {
        keywords: [
          "asthma",
          "pneumonia",
          "breathing",
          "respiratory",
        ],
        doctor: "Pulmonologist",
        icon: "🫁",
        description:
          "Specialist in lungs and respiratory conditions.",
      },
      {
        keywords: [
          "migraine",
          "neurological",
          "neurologic",
        ],
        doctor: "Neurologist",
        icon: "🧠",
        description:
          "Specialist in the brain, nerves and neurological conditions.",
      },
      {
        keywords: [
          "arthritis",
          "joint",
          "bone",
          "orthopedic",
        ],
        doctor: "Orthopedic Specialist",
        icon: "🦴",
        description:
          "Specialist in bones, joints and musculoskeletal conditions.",
      },
      {
        keywords: [
          "skin",
          "rash",
          "dermat",
        ],
        doctor: "Dermatologist",
        icon: "🧴",
        description:
          "Specialist in skin, hair and nail conditions.",
      },
      {
        keywords: [
          "gastritis",
          "gastric",
          "stomach",
          "digestive",
        ],
        doctor: "Gastroenterologist",
        icon: "🩺",
        description:
          "Specialist in the digestive system and gastrointestinal conditions.",
      },
      {
        keywords: [
          "kidney",
          "renal",
        ],
        doctor: "Nephrologist",
        icon: "🫘",
        description:
          "Specialist in kidney health and renal conditions.",
      },
      {
        keywords: [
          "liver",
          "hepatic",
        ],
        doctor: "Hepatologist",
        icon: "🫀",
        description:
          "Specialist in liver-related conditions.",
      },
      {
        keywords: [
          "cold",
          "flu",
          "viral",
          "infection",
        ],
        doctor: "General Physician",
        icon: "👨‍⚕️",
        description:
          "Provides general medical evaluation and treatment.",
      },
    ];

    for (const recommendation of recommendations) {
      const matched = recommendation.keywords.some(
        (keyword) =>
          diseaseText.includes(keyword)
      );

      if (matched) {
        return recommendation;
      }
    }

    return {
      doctor: "General Physician",
      icon: "👨‍⚕️",
      description:
        "Recommended for initial medical evaluation and further referral if required.",
    };
  };

  // =========================================
  // SAVE PREDICTION
  // =========================================

  const savePrediction = async (
    disease,
    recommendation
  ) => {
    setSaving(true);

    try {
      const now = new Date();

      const predictionDate =
        now.toISOString();

      const response = await fetch(
        "https://ai-healthcare-backend-5dud.onrender.com/api/predictions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            patientName: patientName.trim(),

            patient_name: patientName.trim(),

            gender: gender,

            age: age ? Number(age) : null,

            predictedDisease: disease,

            predicted_disease: disease,

            disease: disease,

            modelUsed: "RandomForest",

            model_used: "RandomForest",

            predictionDate: predictionDate,

            prediction_date: predictionDate,

            createdAt: predictionDate,

            created_at: predictionDate,

            symptoms: selectedSymptoms,

            recommendedDoctor:
              recommendation.doctor,

            doctorSpecialization:
              recommendation.doctor,

            recommendation:
              recommendation.description,
          }),
        }
      );

      const text = await response.text();

      console.log(
        "Prediction save response:",
        text
      );

      if (!response.ok) {
        console.warn(
          "Prediction history could not be saved:",
          text
        );
      }
    } catch (saveError) {
      console.error(
        "Prediction history save error:",
        saveError
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // PREDICT DISEASE
  // =========================================

  const predictDisease = async () => {
    setError("");

    setPrediction(null);

    setDoctorRecommendation(null);

    // =========================================
    // VALIDATE PATIENT
    // =========================================

    if (!patientName.trim()) {
      alert(
        "Please enter the patient name."
      );

      return;
    }

    if (!gender) {
      alert(
        "Please select the patient gender."
      );

      return;
    }

    if (!age) {
      alert(
        "Please enter the patient age."
      );

      return;
    }

    if (
      Number(age) <= 0 ||
      Number(age) > 120
    ) {
      alert(
        "Please enter a valid age between 1 and 120."
      );

      return;
    }

    // =========================================
    // VALIDATE SYMPTOMS
    // =========================================

    if (selectedSymptoms.length === 0) {
      alert(
        "Please select at least one symptom."
      );

      return;
    }

    setLoading(true);

    try {
      // =========================================
      // CREATE ML REQUEST
      // =========================================

      const requestData = {};

      symptomsList.forEach((symptom) => {
        requestData[symptom] =
          symptoms[symptom] ? 1 : 0;
      });

      console.log(
        "Sending symptoms to ML API:",
        requestData
      );

      // =========================================
      // CALL FLASK ML API
      // =========================================

      const response = await fetch(
        "https://ai-healthcare-ml.onrender.com/predict",
     
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestData),
        }
      );

      const text =
        await response.text();

      console.log(
        "ML API response:",
        text
      );

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          "ML API returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Disease prediction failed."
        );
      }

      // =========================================
      // GET DISEASE
      // =========================================

      const disease =
        data.disease ||
        data.predictedDisease ||
        data.predicted_disease ||
        data.prediction ||
        data.result;

      if (!disease) {
        throw new Error(
          "Disease prediction was not returned by the ML API."
        );
      }

      // =========================================
      // DOCTOR
      // =========================================

      const recommendation =
        getDoctorRecommendation(disease);

      setPrediction(disease);

      setDoctorRecommendation(
        recommendation
      );

      // =========================================
      // SAVE TO DATABASE
      // =========================================

      await savePrediction(
        disease,
        recommendation
      );

      // =========================================
      // SUCCESS ALERT
      // =========================================

      alert(
        `✅ Prediction completed!\n\nPatient: ${patientName}\nPredicted Disease: ${disease}\nRecommended Specialist: ${recommendation.doctor}`
      );
    } catch (predictionError) {
      console.error(
        "Prediction error:",
        predictionError
      );

      setError(
        predictionError.message ||
          "Unable to predict disease."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // NAVIGATION
  // =========================================

  const navigateTo = (page) => {
    if (typeof setPage === "function") {
      setPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      alert(
        "Navigation is not configured."
      );
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="prediction-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .prediction-page {
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

        .prediction-container {
          max-width: 1250px;
          margin: auto;
        }

        .prediction-header {
          position: relative;
          overflow: hidden;
          padding: 40px;
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

        .prediction-header h1 {
          margin: 0;
          font-size: 38px;
          font-weight: 850;
        }

        .prediction-header p {
          margin: 10px 0 0;
          max-width: 850px;
          color:
            rgba(255,255,255,0.87);
          line-height: 1.6;
          font-size: 15px;
        }

        .prediction-card {
          background: white;
          padding: 30px;
          border-radius: 22px;
          border:
            1px solid #e0edf4;

          box-shadow:
            0 10px 30px
            rgba(30,80,100,0.08);

          margin-bottom: 25px;
        }

        .prediction-card h2 {
          margin: 0;
          color: #075985;
          font-size: 23px;
        }

        .instruction {
          margin: 8px 0 22px;
          color: #718692;
          font-size: 14px;
        }

        /* PATIENT FORM */

        .patient-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .input-group label {
          color: #315363;
          font-size: 13px;
          font-weight: 750;
        }

        .input-group input,
        .input-group select {
          width: 100%;
          padding: 13px 14px;

          border:
            1px solid #d4e5ec;

          border-radius: 10px;

          outline: none;

          background: #fbfdff;

          color: #254b5d;

          font-size: 14px;

          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .input-group input:focus,
        .input-group select:focus {
          border-color: #00a6d6;

          box-shadow:
            0 0 0 3px
            rgba(0,166,214,0.10);
        }

        /* SYMPTOMS */

        .symptoms-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 14px;
        }

        .symptom-label {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 15px;

          border:
            1px solid #dceaf0;

          border-radius: 12px;

          background: #f8fcfe;

          cursor: pointer;

          transition:
            all 0.2s ease;

          color: #315363;
          font-size: 14px;
          font-weight: 650;
        }

        .symptom-label:hover {
          border-color: #00a6d6;
          transform: translateY(-2px);

          box-shadow:
            0 5px 15px
            rgba(0,150,190,0.10);
        }

        .symptom-label.selected {
          background:
            linear-gradient(
              135deg,
              #e5f8ff,
              #effcff
            );

          border-color: #00a6d6;
          color: #075985;

          box-shadow:
            0 5px 15px
            rgba(0,150,190,0.10);
        }

        .symptom-label input {
          width: 18px;
          height: 18px;

          accent-color: #0077b6;
          cursor: pointer;
        }

        .selected-summary {
          margin-top: 20px;
          padding: 14px 16px;
          border-radius: 10px;

          background: #f5faff;

          color: #496b7a;
          font-size: 13px;
        }

        .selected-summary strong {
          color: #075985;
        }

        /* ACTIONS */

        .prediction-actions {
          display: flex;
          gap: 12px;
          margin-top: 25px;
          flex-wrap: wrap;
        }

        .predict-button {
          flex: 1;
          min-width: 220px;

          padding: 15px 22px;

          border: none;
          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00a8c6
            );

          color: white;

          font-size: 15px;
          font-weight: 800;

          cursor: pointer;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .predict-button:hover {
          transform: translateY(-3px);

          box-shadow:
            0 10px 22px
            rgba(0,119,182,0.25);
        }

        .predict-button:disabled {
          background: #9eabb2;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .clear-button {
          padding: 15px 22px;

          border: none;
          border-radius: 11px;

          background: #edf2f4;

          color: #425b66;

          font-weight: 750;

          cursor: pointer;
        }

        .clear-button:hover {
          background: #e1e8eb;
        }

        /* ERROR */

        .error-box {
          margin-top: 20px;
          padding: 16px;

          border-radius: 11px;

          background: #fff1f2;

          border:
            1px solid #fecdd3;

          color: #b42318;

          font-weight: 650;

          line-height: 1.5;
        }

        /* RESULT */

        .result-card {
          padding: 30px;
          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #ecfff4,
              #f8fffb
            );

          border:
            1px solid #b7e5c6;

          box-shadow:
            0 10px 30px
            rgba(40,150,80,0.10);

          margin-bottom: 25px;
        }

        .result-title {
          color: #24733a;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .patient-result {
          margin-top: 12px;
          padding: 13px 15px;

          border-radius: 10px;

          background: white;

          border:
            1px solid #d7ebdf;

          color: #496b57;

          font-size: 13px;
        }

        .patient-result strong {
          color: #14532d;
        }

        .disease-name {
          margin-top: 15px;

          color: #14532d;

          font-size: 34px;

          font-weight: 850;
        }

        .result-note {
          margin-top: 8px;
          color: #547160;
          font-size: 13px;
          line-height: 1.6;
        }

        /* DOCTOR */

        .doctor-card {
          display: flex;
          align-items: center;
          gap: 20px;

          margin-top: 25px;
          padding: 22px;

          border-radius: 17px;

          background: white;

          border:
            1px solid #dcecf2;

          box-shadow:
            0 7px 20px
            rgba(30,80,100,0.07);
        }

        .doctor-icon {
          width: 70px;
          height: 70px;

          display: grid;
          place-items: center;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #e5f8ff,
              #effcff
            );

          font-size: 38px;
          flex-shrink: 0;
        }

        .doctor-content {
          flex: 1;
        }

        .doctor-label {
          color: #78909c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .doctor-name {
          margin-top: 5px;
          color: #075985;
          font-size: 23px;
          font-weight: 850;
        }

        .doctor-description {
          margin-top: 6px;
          color: #607d8b;
          font-size: 13px;
          line-height: 1.5;
        }

        /* RESULT BUTTONS */

        .result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
        }

        .result-button {
          padding: 13px 18px;

          border: none;
          border-radius: 10px;

          font-weight: 800;
          cursor: pointer;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .result-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 7px 16px
            rgba(0,0,0,0.13);
        }

        .doctor-button {
          background:
            linear-gradient(
              135deg,
              #0077b6,
              #00a8c6
            );

          color: white;
        }

        .appointment-button {
          background:
            linear-gradient(
              135deg,
              #00897b,
              #26a69a
            );

          color: white;
        }

        .history-button {
          background:
            linear-gradient(
              135deg,
              #6a1b9a,
              #8e24aa
            );

          color: white;
        }

        /* SAFETY */

        .safety-card {
          padding: 20px;
          border-radius: 16px;

          background: #fffaf0;

          border:
            1px solid #f3d69b;

          color: #74551a;

          font-size: 13px;
          line-height: 1.6;

          margin-top: 20px;
        }

        @media (max-width: 900px) {

          .patient-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .symptoms-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {

          .prediction-page {
            padding:
              20px 12px 40px;
          }

          .prediction-header {
            padding: 28px 20px;
          }

          .prediction-header h1 {
            font-size: 29px;
          }

          .prediction-card {
            padding: 20px;
          }

          .patient-grid {
            grid-template-columns: 1fr;
          }

          .symptoms-grid {
            grid-template-columns: 1fr;
          }

          .doctor-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .prediction-actions {
            flex-direction: column;
          }

          .predict-button {
            min-width: auto;
          }
        }

      `}</style>

      <div className="prediction-container">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <section className="prediction-header">

          <h1>
            🤖 AI Disease Prediction
          </h1>

          <p>
            Enter patient information and select
            the symptoms experienced by the patient.
            The machine-learning model will analyze
            the symptoms and provide a possible
            disease prediction.
          </p>

        </section>

        {/* ================================= */}
        {/* PATIENT INFORMATION */}
        {/* ================================= */}

        <section className="prediction-card">

          <h2>
            👤 Patient Information
          </h2>

          <p className="instruction">
            Enter the details of the patient before
            starting the AI prediction.
          </p>

          <div className="patient-grid">

            <div className="input-group">

              <label>
                Patient Name *
              </label>

              <input
                type="text"
                value={patientName}
                onChange={(e) =>
                  setPatientName(e.target.value)
                }
                placeholder="Enter patient name"
              />

            </div>

            <div className="input-group">

              <label>
                Gender *
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
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

            <div className="input-group">

              <label>
                Age *
              </label>

              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
                placeholder="Enter age"
              />

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* SYMPTOMS */}
        {/* ================================= */}

        <section className="prediction-card">

          <h2>
            🩺 Select Symptoms
          </h2>

          <p className="instruction">
            Select all symptoms that apply to the
            patient.
          </p>

          <div className="symptoms-grid">

            {symptomsList.map((symptom) => (

              <label
                key={symptom}
                className={
                  `symptom-label ${
                    symptoms[symptom]
                      ? "selected"
                      : ""
                  }`
                }
              >

                <input
                  type="checkbox"
                  checked={
                    symptoms[symptom]
                  }
                  onChange={() =>
                    handleSymptomChange(
                      symptom
                    )
                  }
                />

                <span>
                  {symptomLabels[symptom]}
                </span>

              </label>

            ))}

          </div>

          {/* SELECTED COUNT */}

          <div className="selected-summary">

            <strong>
              Selected symptoms:
            </strong>{" "}

            {selectedSymptoms.length}

            {" "}of{" "}

            {symptomsList.length}

          </div>

          {/* ACTIONS */}

          <div className="prediction-actions">

            <button
              className="predict-button"
              onClick={predictDisease}
              disabled={loading}
            >

              {loading
                ? "⏳ Analyzing Symptoms..."
                : "🔍 Predict Disease"}

            </button>

            <button
              className="clear-button"
              onClick={clearSymptoms}
              disabled={loading}
            >
              🗑️ Clear Symptoms
            </button>

          </div>

          {/* ERROR */}

          {error && (

            <div className="error-box">

              ❌ {error}

              <br />

              <small>
                Make sure your Flask ML server
                is running on port 5001.
              </small>

            </div>

          )}

        </section>

        {/* ================================= */}
        {/* RESULT */}
        {/* ================================= */}

        {prediction && (

          <section className="result-card">

            <div className="result-title">
              AI PREDICTION RESULT
            </div>

            {/* PATIENT */}

            <div className="patient-result">

              👤 <strong>Patient:</strong>{" "}
              {patientName}

              {" "} | {" "}

              ⚥ <strong>Gender:</strong>{" "}
              {gender}

              {" "} | {" "}

              🎂 <strong>Age:</strong>{" "}
              {age}

            </div>

            {/* DISEASE */}

            <div className="disease-name">
              🦠 {prediction}
            </div>

            <p className="result-note">

              The AI model has identified this as
              the possible disease based on the
              symptoms selected above.

            </p>

            {/* DOCTOR */}

            {doctorRecommendation && (

              <div className="doctor-card">

                <div className="doctor-icon">
                  {doctorRecommendation.icon}
                </div>

                <div className="doctor-content">

                  <div className="doctor-label">
                    RECOMMENDED SPECIALIST
                  </div>

                  <div className="doctor-name">
                    {doctorRecommendation.doctor}
                  </div>

                  <div className="doctor-description">
                    {doctorRecommendation.description}
                  </div>

                </div>

              </div>

            )}

            {/* BUTTONS */}

            <div className="result-actions">

              <button
                className="result-button doctor-button"
                onClick={() =>
                  navigateTo("doctor")
                }
              >
                👨‍⚕️ View Doctors
              </button>

              <button
                className="result-button appointment-button"
                onClick={() =>
                  navigateTo("appointmentForm")
                }
              >
                📅 Book Appointment
              </button>

              <button
                className="result-button history-button"
                onClick={() =>
                  navigateTo("history")
                }
              >
                📊 View History
              </button>

            </div>

            {/* SAVING */}

            {saving && (

              <p
                style={{
                  marginTop: "15px",
                  color: "#607d8b",
                  fontSize: "12px",
                }}
              >
                💾 Saving prediction to history...
              </p>

            )}

            {/* SAFETY */}

            <div className="safety-card">

              ⚠️ <strong>Important:</strong>{" "}

              This AI prediction is for informational
              and decision-support purposes only.
              It is not a medical diagnosis. Please
              consult a qualified healthcare professional
              for proper evaluation and treatment.

            </div>

          </section>

        )}

      </div>

    </div>
  );
}

export default PredictDisease;