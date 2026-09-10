import React, { useState } from "react";

function Login({ onLogin, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-healthcare-backend-5dud.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        alert(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Check user
      if (!data.user) {
        alert("Login successful but user information was not returned.");
        setLoading(false);
        return;
      }

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Save token if backend sends one
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      alert(
        `Welcome ${data.user.name || "User"}!`
      );

      // Send user to App.js
      if (typeof onLogin === "function") {
        onLogin(data.user);
      } else {
        console.error(
          "onLogin function was not provided"
        );
      }

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Unable to connect to backend.\n\n" +
        "Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "15px",
        background: "#ffffff",
        boxShadow:
          "0 5px 20px rgba(0,0,0,0.15)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1565C0",
          marginBottom: "10px",
        }}
      >
        🔐 Login
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "25px",
        }}
      >
        AI Healthcare Management System
      </p>

      <form onSubmit={handleLogin}>

        {/* EMAIL */}

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "600",
          }}
        >
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          autoComplete="email"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontSize: "15px",
          }}
        />

        {/* PASSWORD */}

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontWeight: "600",
          }}
        >
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "25px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontSize: "15px",
          }}
        />

        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "8px",
            background:
              loading
                ? "#999"
                : "linear-gradient(90deg, #1565C0, #42A5F5)",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

      {/* REGISTER */}

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#666",
        }}
      >
        Don't have an account?
      </p>

      <button
        type="button"
        onClick={() => {
          if (typeof setPage === "function") {
            setPage("register");
          }
        }}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: "8px",
          border: "1px solid #1565C0",
          background: "white",
          color: "#1565C0",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        📝 Create Account
      </button>
    </div>
  );
}

export default Login;