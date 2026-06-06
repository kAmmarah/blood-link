import { useState } from "react";
import { useAppData } from "../data/AppDataContext";

const URGENCY_COLOR = { critical: "#c0392b", high: "#e67e22", medium: "#f1c40f", low: "#27ae60" };

export default function CoordinatorDashboard() {
  const { requests, donors } = useAppData();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter || r.urgency === filter);

  const totalUnits = requests.reduce((s, r) => s + r.units, 0);
  const fulfilledUnits = requests.reduce((s, r) => s + r.fulfilled, 0);
  const criticalCount = requests.filter(r => r.urgency === "critical" && r.status !== "fulfilled").length;
  const availableDonors = donors.filter(d => d.available).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: "#f0ece4" }}>Coordinator Dashboard</h2>
          <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Full situational awareness — all hospitals, all requests</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0e2b1a", border: "1px solid #27ae60", borderRadius: 8, padding: "6px 14px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ae60", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 13, color: "#27ae60", fontWeight: 600 }}>System Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Units Needed", value: totalUnits, color: "#3498db", icon: "🩸" },
          { label: "Units Fulfilled", value: fulfilledUnits, color: "#27ae60", icon: "✓" },
          { label: "Critical Requests", value: criticalCount, color: "#c0392b", icon: "⚡" },
          { label: "Available Donors", value: availableDonors, color: "#e67e22", icon: "👤" },
        ].map(s => (
          <div key={s.label} style={{ background: "#161616", border: "1px solid #222", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 30, fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#888" }}>Overall fulfillment wave</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#f0ece4" }}>{Math.round((fulfilledUnits / totalUnits) * 100)}%</span>
        </div>
        <div style={{ height: 8, background: "#1e1e1e", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(fulfilledUnits / totalUnits) * 100}%`, background: "linear-gradient(90deg, #c0392b, #27ae60)", borderRadius: 4, transition: "width 1s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "#444" }}>{fulfilledUnits} units confirmed</span>
          <span style={{ fontSize: 11, color: "#444" }}>{totalUnits - fulfilledUnits} units remaining</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "pending", "fulfilled", "critical", "high", "medium"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500, border: filter === f ? "1px solid #c0392b" : "1px solid #2a2a2a", background: filter === f ? "#c0392b22" : "#1e1e1e", color: filter === f ? "#c0392b" : "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Request Table */}
      <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["Hospital", "Blood", "Units", "Progress", "Urgency", "Status", "Time"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #1a1a1a" : "none", transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 500, color: "#f0ece4" }}>{r.hospital}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: "#c0392b22", color: "#c0392b", padding: "3px 10px", borderRadius: 6, fontSize: 13, fontWeight: 700 }}>{r.bloodGroup}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#aaa" }}>{r.units}</td>
                <td style={{ padding: "12px 16px", minWidth: 140 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(r.fulfilled / r.units) * 100}%`, background: r.status === "fulfilled" ? "#27ae60" : "#c0392b", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>{r.fulfilled}/{r.units}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: URGENCY_COLOR[r.urgency] + "22", color: URGENCY_COLOR[r.urgency], padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{r.urgency}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ background: r.status === "fulfilled" ? "#0e2b1a" : "#2b150e", color: r.status === "fulfilled" ? "#27ae60" : "#e67e22", padding: "3px 10px", borderRadius: 6, fontSize: 11 }}>
                    {r.status === "fulfilled" ? "✓ Fulfilled" : "⏳ Pending"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Donor Map Summary */}
      <div style={{ marginTop: 20, background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 20 }}>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Blood Group Availability</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => {
            const count = donors.filter(d => d.bloodGroup === bg && d.available).length;
            return (
              <div key={bg} style={{ textAlign: "center", background: "#1a1a1a", borderRadius: 10, padding: "12px 8px", border: count > 0 ? "1px solid #27ae6055" : "1px solid #2a2a2a" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: count > 0 ? "#27ae60" : "#333" }}>{count}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{bg}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
