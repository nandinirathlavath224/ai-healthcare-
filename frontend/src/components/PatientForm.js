import React, { useState } from "react";

function PatientForm({ getPatients }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const addPatient = async () => {
    if (!name || !age || !gender || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/patients/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            age,
            gender,
            phone,
            address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add patient"
        );
      }

      alert(data.message || "Patient added successfully!");

      // Clear form
      setName("");
      setAge("");
      setGender("");
      setPhone("");
      setAddress("");

      // Refresh patient list
      if (getPatients) {
        await getPatients();
      }
    } catch (error) {
      console.error("Add patient error:", error);

      alert(
        error.message ||
          "Unable to add patient. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "30px",
        background: "white",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          color: "#075985",
          marginBottom: "25px",
        }}
      >
        👤 Add Patient
      </h2>

      {/* NAME */}
      <input
        type="text"
        placeholder="Patient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      {/* AGE */}
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={inputStyle}
      />

      {/* GENDER */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* PHONE */}
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={inputStyle}
      />

      {/* ADDRESS */}
      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows="4"
        style={{
          ...inputStyle,
          resize: "vertical",
        }}
      />

      {/* BUTTON */}
      <button
        onClick={addPatient}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          border: "none",
          borderRadius: "10px",
          background:
            "linear-gradient(135deg, #0077b6, #00a8c6)",
          color: "white",
          fontSize: "16px",
          fontWeight: "800",
          cursor: loading
            ? "not-allowed"
            : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading
          ? "⏳ Adding Patient..."
          : "➕ Add Patient"}
      </button>
    </div>
  );
}

// Common input style
const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  marginBottom: "15px",
  border: "1px solid #d5e3ea",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

export default PatientForm;