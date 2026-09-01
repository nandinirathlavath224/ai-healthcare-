import React, { useState } from "react";

function AppointmentForm() {
  const [appointment, setAppointment] = useState({
    patient_name: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
  });

  const handleChange = (e) => {
    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://ai-healthcare-backend-5dud.onrender.com/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });

      const data = await response.json();

      alert(data.message);

      setAppointment({
        patient_name: "",
        doctor_name: "",
        appointment_date: "",
        appointment_time: "",
      });

    } catch (error) {
      console.log(error);
      alert("Appointment Booking Failed");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Book Appointment</h2>

      <form onSubmit={bookAppointment}>

        <input
          type="text"
          name="patient_name"
          placeholder="Patient Name"
          value={appointment.patient_name}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="doctor_name"
          placeholder="Doctor Name"
          value={appointment.doctor_name}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="date"
          name="appointment_date"
          value={appointment.appointment_date}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="time"
          name="appointment_time"
          value={appointment.appointment_time}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">
          Book Appointment
        </button>

      </form>
    </div>
  );
}

export default AppointmentForm;