import { useState } from "react";
import HospitalConnect from "./components/HospitalConnect";
import DonorRegistration from "./components/DonorRegistration";
import AIChatAgent from "./components/AIChatAgent";
import CoordinatorDashboard from "./components/CoordinatorDashboard";
import { AppDataProvider } from "./data/AppDataContext";

const NAV = [
  { id: "hospital", label: "Hospital Connect", icon: "🏥" },
  { id: "donor", label: "Donor Portal", icon: "🩸" },
  { id: "ai", label: "AI Agent", icon: "🤖" },
  { id: "dashboard", label: "Coordinator", icon: "📊" },
];

export default function App() {
  const [active, setActive] = useState("hospital");

  return (
    <AppDataProvider>
      <div style={{ minHeight: "100vh", background: "#0f0f0f", fontFamily: "'DM Sans', sans-serif", color: "#f0ece4" }}>
        {/* Header */}
        <header style={{ borderBottom: "1px solid #1e1e1e", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, background: "#0f0f0f", zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22, color: "#c0392b" }}>⬡</span>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", color: "#f0ece4" }}>BloodLink</span>
            <span style={{ fontSize: 11, color: "#555", marginLeft: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Pakistan</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                  background: active === n.id ? "#c0392b" : "transparent",
                  color: active === n.id ? "#fff" : "#888",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ marginRight: 5 }}>{n.icon}</span>{n.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#444" }}>Live System</div>
        </header>

        {/* Content */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
          {active === "hospital" && <HospitalConnect />}
          {active === "donor" && <DonorRegistration />}
          {active === "ai" && <AIChatAgent />}
          {active === "dashboard" && <CoordinatorDashboard />}
        </main>
      </div>
    </AppDataProvider>
  );
}
