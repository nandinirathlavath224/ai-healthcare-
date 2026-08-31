import React, { useState } from "react";

function Navbar({ setPage, currentPage }) {
  const [hovered, setHovered] = useState(null);

  const goTo = (page) => {
    if (typeof setPage === "function") {
      setPage(page);
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: "🏠",
    },
    {
      id: "patient",
      label: "Patient",
      icon: "👤",
    },
    {
      id: "doctor",
      label: "Doctor",
      icon: "👨‍⚕️",
    },
    {
      id: "admin",
      label: "Admin",
      icon: "🛡️",
    },
    {
      id: "prediction",
      label: "AI Prediction",
      icon: "🤖",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: "📅",
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: "💊",
    },
    {
      id: "history",
      label: "History",
      icon: "📊",
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: "🔔",
    },
    {
  id: "analytics",
  label: "Analytics",
  icon: "📈",
},
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,

        background:
          "linear-gradient(135deg, #006d9c 0%, #008fb8 45%, #00b4d8 100%)",

        padding: "12px 22px",

        boxShadow:
          "0 8px 30px rgba(0, 80, 120, 0.22)",

        borderBottom:
          "1px solid rgba(255,255,255,0.25)",

        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        {/* =====================================
            LOGO
        ====================================== */}

        <div
          onClick={() => goTo("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",

            color: "white",

            fontSize: "22px",
            fontWeight: "800",

            cursor: "pointer",
            whiteSpace: "nowrap",

            letterSpacing: "0.2px",

            transition:
              "transform 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "scale(1)";
          }}
        >
          <span
            style={{
              width: "40px",
              height: "40px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "12px",

              background:
                "rgba(255,255,255,0.18)",

              border:
                "1px solid rgba(255,255,255,0.3)",

              boxShadow:
                "0 5px 15px rgba(0,0,0,0.12)",

              fontSize: "21px",
            }}
          >
            🏥
          </span>

          <span>
            AI Healthcare
          </span>
        </div>

        {/* =====================================
            NAVIGATION BUTTONS
        ====================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            gap: "7px",

            flexWrap: "wrap",
          }}
        >
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id;

            const isHovered =
              hovered === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  goTo(item.id)
                }
                onMouseEnter={() =>
                  setHovered(item.id)
                }
                onMouseLeave={() =>
                  setHovered(null)
                }
                style={{
                  position: "relative",

                  display: "flex",
                  alignItems: "center",
                  gap: "7px",

                  padding:
                    "10px 13px",

                  borderRadius: "12px",

                  border: isActive
                    ? "1px solid rgba(255,255,255,0.65)"
                    : "1px solid rgba(255,255,255,0.20)",

                  background: isActive
                    ? "rgba(255,255,255,0.24)"
                    : isHovered
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,255,255,0.10)",

                  color: "white",

                  cursor: "pointer",

                  fontSize: "13px",

                  fontWeight: isActive
                    ? "700"
                    : "600",

                  boxShadow: isActive
                    ? "0 6px 18px rgba(0,0,0,0.16)"
                    : isHovered
                    ? "0 5px 15px rgba(0,0,0,0.12)"
                    : "none",

                  transform:
                    isHovered
                      ? "translateY(-2px)"
                      : "translateY(0)",

                  transition:
                    "all 0.25s ease",

                  whiteSpace: "nowrap",

                  outline: "none",
                }}
              >

                {/* ICON */}

                <span
                  style={{
                    fontSize: "15px",

                    transform:
                      isHovered
                        ? "scale(1.12)"
                        : "scale(1)",

                    transition:
                      "transform 0.2s ease",
                  }}
                >
                  {item.icon}
                </span>

                {/* LABEL */}

                <span>
                  {item.label}
                </span>

                {/* ACTIVE INDICATOR */}

                {isActive && (
                  <span
                    style={{
                      position: "absolute",

                      left: "50%",
                      bottom: "-5px",

                      transform:
                        "translateX(-50%)",

                      width: "22px",
                      height: "3px",

                      borderRadius: "10px",

                      background: "white",

                      boxShadow:
                        "0 0 10px rgba(255,255,255,0.8)",
                    }}
                  />
                )}

                {/* ALERT BADGE */}

                {item.id === "alerts" && (
                  <span
                    style={{
                      position: "absolute",

                      top: "-6px",
                      right: "-5px",

                      minWidth: "17px",
                      height: "17px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      borderRadius: "50%",

                      background:
                        "#ff4757",

                      color: "white",

                      fontSize: "9px",

                      fontWeight: "800",

                      border:
                        "2px solid #008fb8",

                      boxShadow:
                        "0 2px 7px rgba(0,0,0,0.2)",
                    }}
                  >
                    !
                  </span>
                )}

              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;