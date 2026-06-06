import { useState } from "react";
import { useAppData } from "../data/AppDataContext";

const URGENCY_COLOR = { critical: "#c0392b", high: "#e67e22", medium: "#f1c40f", low: "#27ae60" };
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function HospitalConnect() {
  const { requests, addRequest } = useAppData();
  const [form, setForm] = useState({ hospital: "", bloodGroup: "O+", units: 1, urgency: "high" });
  const [submitted, setSubmitted] = useState(false);

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.hospital.trim()) return;
    addRequest(form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ hospital: "", bloodGroup: "O+", units: 1, urgency: "high" });
  };

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: "#f0ece4" }}>Hospital Connect</h2>
      <p style={{ color: "#666", marginBottom: 28, fontSize: 14 }}>Submit a blood request — donors are matched instantly</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Form */}
        <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>New Request</p>

          <label style={lStyle}>Hospital Name</label>
          <input
            value={form.hospital}
            onChange={e => handle("hospital", e.target.value)}
            placeholder="e.g. Aga Khan Hospital"
            style={inputStyle}
          />

          <label style={lStyle}>Blood Group</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {BLOOD_GROUPS.map(g => (
              <button key={g} onClick={() => handle("bloodGroup", g)}
                style={{ ...pillStyle, background: form.bloodGroup === g ? "#c0392b" : "#1e1e1e", color: form.bloodGroup === g ? "#fff" : "#888", border: form.bloodGroup === g ? "1px solid #c0392b" : "1px solid #2a2a2a" }}>
                {g}
              </button>
            ))}
          </div>

          <label style={lStyle}>Units Needed: <span style={{ color: "#c0392b" }}>{form.units}</span></label>
          <input type="range" min={1} max={10} step={1} value={form.units} onChange={e => handle("units", Number(e.target.value))}
            style={{ width: "100%", marginBottom: 16, accentColor: "#c0392b" }} />

          <label style={lStyle}>Urgency Level</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["critical", "high", "medium", "low"].map(u => (
              <button key={u} onClick={() => handle("urgency", u)}
                style={{ ...pillStyle, background: form.urgency === u ? URGENCY_COLOR[u] + "22" : "#1e1e1e", color: form.urgency === u ? URGENCY_COLOR[u] : "#888", border: `1px solid ${form.urgency === u ? URGENCY_COLOR[u] : "#2a2a2a"}`, flex: 1 }}>
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            ))}
          </div>

          <button onClick={submit}
            style={{ width: "100%", padding: "12px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.target.style.opacity = 0.85} onMouseLeave={e => e.target.style.opacity = 1}>
            Send Request →
          </button>

          {submitted && <div style={{ marginTop: 12, padding: "10px 14px", background: "#0e2b1a", border: "1px solid #27ae60", borderRadius: 8, color: "#27ae60", fontSize: 13 }}>
            ✓ Request sent — matching donors now...
          </div>}
        </div>

        {/* Live Status */}
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Requests</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {requests.map(r => (
              <div key={r.id} style={{ background: "#161616", border: "1px solid #222", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f0ece4" }}>{r.hospital}</span>
                    <span style={{ marginLeft: 8, fontSize: 12, color: "#555" }}>{r.time}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ background: "#c0392b22", color: "#c0392b", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{r.bloodGroup}</span>
                    <span style={{ background: URGENCY_COLOR[r.urgency] + "22", color: URGENCY_COLOR[r.urgency], padding: "2px 8px", borderRadius: 6, fontSize: 11 }}>{r.urgency}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 5, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(r.fulfilled / r.units) * 100}%`, background: r.status === "fulfilled" ? "#27ae60" : "#c0392b", borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>{r.fulfilled}/{r.units} units</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: r.status === "fulfilled" ? "#0e2b1a" : "#2b150e", color: r.status === "fulfilled" ? "#27ae60" : "#e67e22" }}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const lStyle = { fontSize: 12, color: "#666", marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const inputStyle = { width: "100%", padding: "10px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#f0ece4", fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none" };
const pillStyle = { padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.12s" };
